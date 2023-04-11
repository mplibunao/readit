import { Dependencies } from '@api/infra/diConfig'
import { PG } from '@api/infra/pg/createClient'
import {
	TagData,
	DeleteOptions,
	DeleteQuery,
	SelectOptions,
	SelectQuery,
	Trx,
	UpdateOptions,
	UpdateQuery,
	InsertableCommunityTag,
	InsertableTag,
} from '@api/infra/pg/types'
import { AlreadyExists, NotFound } from '@api/utils/errors/baseError'
import {
	DBError,
	InvalidDeleteFilter,
	InvalidQueryFilter,
} from '@api/utils/errors/repoErrors'
import { NoResultError, sql } from 'kysely'
import Pg from 'pg'

type TagDeleteQuery = DeleteQuery<'tags'>
type TagDeleteOptions = DeleteOptions<'tags'>
type TagUpdateQuery = UpdateQuery<'tags'>
type TagUpdateOptions = UpdateOptions<'tags'>
type TagQuery = SelectQuery<'tags'>
type TagQueryOptions = SelectOptions<'tags'>

export class TagRepository {
	private pg: PG

	constructor(deps: Dependencies) {
		this.pg = deps.pg
	}

	private findQuery({ where }: TagQueryOptions, trx?: Trx): TagQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.selectFrom('tags')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof TagData, '=', value)
		}

		return query
	}

	private removeQuery({ where }: TagDeleteOptions, trx?: Trx): TagDeleteQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidDeleteFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.deleteFrom('tags')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof TagData, '=', value)
		}

		return query
	}

	private updateQuery(
		{ where, data }: TagUpdateOptions,
		trx?: Trx,
	): TagUpdateQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidDeleteFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.updateTable('tags').set(data)

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof TagData, '=', value)
		}

		return query
	}

	async updateTakeOneOrThrow(options: TagUpdateOptions, trx?: Trx) {
		try {
			return await this.updateQuery(options, trx)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Tag not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	async getTags(trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			return await connection
				.selectFrom('tags')
				.where('deletedAt', 'is', null)
				.select(['id', 'name', 'isRecommended'])
				.execute()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	async createTags(params: InsertableTag[], trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			return await connection.insertInto('tags').values(params).execute()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				if (error.code === '23505') {
					throw new AlreadyExists({
						cause: error,
						message: 'Tag already exists',
					})
				}
			}
			throw new DBError({ cause: error })
		}
	}

	async createCommunityTags(params: InsertableCommunityTag[], trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			return await connection
				.insertInto('communityTags')
				.values(params)
				.execute()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				if (error.code === '23505') {
					throw new AlreadyExists({
						cause: error,
						message: 'Community tag already exists',
					})
				}
			}
			throw new DBError({ cause: error })
		}
	}

	async upsertUserInterests(
		params: { userId: string; tagIds: string[] },
		trx?: Trx,
	) {
		try {
			const connection = trx ? trx : this.pg
			const insertableUserInterests = params.tagIds.map((tagId) => ({
				userId: params.userId,
				tagId,
			}))
			return await connection
				.with('inserted', (db) =>
					db.insertInto('userInterests').values(insertableUserInterests),
				)
				.deleteFrom('userInterests')
				.where('userId', 'not in', params.tagIds)
				.execute()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				if (error.code === '23505') {
					throw new AlreadyExists({
						cause: error,
						message: 'User interest already exists',
					})
				}
			}
			throw new DBError({ cause: error })
		}
	}

	async getUserInterests(userId: string, trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			return await connection
				.selectFrom('userInterests')
				.leftJoin('tags', 'userInterests.tagId', 'tags.id')
				.where('userId', '=', userId)
				.select(['tagId', 'name'])
				.execute()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	async getRecommendedCommunities(
		{
			userId,
			recommendationNum,
		}: { userId: string; recommendationNum: number },
		trx?: Trx,
	) {
		try {
			const connection = trx ? trx : this.pg
			const { countAll } = connection.fn
			return await connection
				.selectFrom((eb) =>
					eb
						.selectFrom('communityTags')
						.innerJoin(
							'communities',
							'communities.id',
							'communityTags.communityId',
						)
						.innerJoin('tags', 'communityTags.tagId', 'tags.id')
						.innerJoin('userInterests', 'tags.id', 'userInterests.tagId')
						.innerJoin(
							connection
								.selectFrom('communityTags')
								.innerJoin(
									'userInterests',
									'communityTags.tagId',
									'userInterests.tagId',
								)
								.where('userInterests.userId', '=', userId)
								.select([
									'communityTags.communityId',
									countAll<number>().as('numCommonTags'),
								])
								.groupBy('communityTags.communityId')
								.as('commonTags'),
							'commonTags.communityId',
							'communities.id',
						)
						.where('userInterests.userId', '=', userId)
						.groupBy([
							'tags.id',
							'communities.id',
							'commonTags.numCommonTags',
							'communityTags.isPrimary',
						])
						.select([
							'tags.name as tag',
							'tags.id as tagId',
							'communities.name as community',
							'communities.id as communityId',
							'communities.description as communityDescription',
							'communities.imageUrl as communityImageUrl',
							'numCommonTags',
							(eb) =>
								sql<number>`ROW_NUMBER() OVER (PARTITION BY ${eb.ref(
									'tags.id',
								)} ORDER BY ${eb.ref('numCommonTags')} DESC, ${eb.ref(
									'communityTags.isPrimary',
								)} DESC, ${eb.ref('communities.id')})`.as('rank'),
						])
						.as('communityRecommendations'),
				)
				.selectAll()
				.where('rank', '<=', recommendationNum)
				.orderBy('tag')
				.orderBy('rank')
				.execute()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	async getMoreRecommendedCommunities(
		{
			userId,
			recommendationNum,
			tagId,
			offset,
			limit,
		}: {
			userId: string
			recommendationNum: number
			tagId: string
			offset: number
			limit: number
		},
		trx?: Trx,
	) {
		try {
			const connection = trx ? trx : this.pg
			const { countAll } = connection.fn
			return await connection
				.selectFrom((eb) =>
					eb
						.selectFrom('communityTags')
						.innerJoin(
							'communities',
							'communities.id',
							'communityTags.communityId',
						)
						.innerJoin('tags', 'communityTags.tagId', 'tags.id')
						.innerJoin('userInterests', 'tags.id', 'userInterests.tagId')
						.innerJoin(
							connection
								.selectFrom('communityTags')
								.innerJoin(
									'userInterests',
									'communityTags.tagId',
									'userInterests.tagId',
								)
								.where('userInterests.userId', '=', userId)
								.select([
									'communityTags.communityId',
									countAll<number>().as('numCommonTags'),
								])
								.groupBy('communityTags.communityId')
								.as('commonTags'),
							'commonTags.communityId',
							'communities.id',
						)
						.where('userInterests.userId', '=', userId)
						.where('tags.id', '=', tagId)
						.where('communities.id', '!=', userId)
						.groupBy([
							'tags.id',
							'communities.id',
							'commonTags.numCommonTags',
							'communityTags.isPrimary',
						])
						.select([
							'tags.name as tag',
							'tags.id as tagId',
							'communities.name as community',
							'communities.id as communityId',
							'communities.description as communityDescription',
							'communities.imageUrl as communityImageUrl',
							'numCommonTags',
							(eb) =>
								sql<number>`ROW_NUMBER() OVER (PARTITION BY ${eb.ref(
									'tags.id',
								)} ORDER BY ${eb.ref('numCommonTags')} DESC, ${eb.ref(
									'communityTags.isPrimary',
								)} DESC, ${eb.ref('communities.id')})`.as('rank'),
						])
						.as('communityRecommendations'),
				)
				.selectAll()
				.where('rank', '<=', recommendationNum)
				.orderBy('tag')
				.orderBy('rank')
				.offset(offset)
				.limit(limit)
				.execute()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	async findTagByIdOrThrow(id: string, trx?: Trx) {
		try {
			return await this.findQuery({ where: { id } }, trx)
				.selectAll('tags')
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Tag not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	async removeTagByIdOrThrow(id: string, trx?: Trx) {
		try {
			return await this.removeQuery({ where: { id } }, trx)
				.returningAll('tags')
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Tag not found' })
			}
			throw new DBError({ cause: error })
		}
	}
}

import { Dependencies } from '@api/infra/diConfig'
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
import { NoResultError } from 'kysely'
import Pg from 'pg'

type TagDeleteQuery = DeleteQuery<'tags'>
type TagDeleteOptions = DeleteOptions<'tags'>
type TagUpdateQuery = UpdateQuery<'tags'>
type TagUpdateOptions = UpdateOptions<'tags'>
type TagQuery = SelectQuery<'tags'>
type TagQueryOptions = SelectOptions<'tags'>

export type TagRepository = ReturnType<typeof buildTagRepository>

export const buildTagRepository = ({ pg }: Dependencies) => {
	const del = ({ where }: TagDeleteOptions, trx?: Trx): TagDeleteQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidDeleteFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.deleteFrom('tags')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof TagData, '=', value)
		}

		return query
	}

	const find = ({ where }: TagQueryOptions, trx?: Trx): TagQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.selectFrom('tags')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof TagData, '=', value)
		}

		return query
	}

	const update = (
		{ where, data }: TagUpdateOptions,
		trx?: Trx,
	): TagUpdateQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.updateTable('tags').set(data)

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof TagData, '=', value)
		}

		return query
	}

	const findTakeOneOrThrow = async (
		options: TagQueryOptions,
		trx?: Trx,
	): Promise<TagData> => {
		try {
			return await find(options, trx).selectAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Tag not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	const findTakeOne = async (
		options: TagQueryOptions,
		trx?: Trx,
	): Promise<TagData | undefined> => {
		try {
			return await find(options, trx).selectAll().executeTakeFirst()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	const updateTakeOneOrThrow = async (options: TagUpdateOptions, trx?: Trx) => {
		try {
			return await update(options, trx).returningAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Tag not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	const deleteTakeOneOrThrow = async (options: TagDeleteOptions, trx?: Trx) => {
		try {
			return await del(options, trx).returningAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Tag not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	const getTags = async (trx?: Trx) => {
		try {
			const connection = trx ? trx : pg
			return await connection
				.selectFrom('tags')
				.where('deletedAt', 'is', null)
				.select(['id', 'name', 'isRecommended'])
				.execute()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	const createTags = async (params: InsertableTag[], trx?: Trx) => {
		try {
			const connection = trx ? trx : pg
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

	const createCommunityTags = async (
		params: InsertableCommunityTag[],
		trx?: Trx,
	) => {
		try {
			const connection = trx ? trx : pg
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

	const upsertUserInterests = async (
		params: { userId: string; tagIds: string[] },
		trx?: Trx,
	) => {
		try {
			const connection = trx ? trx : pg
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

	const getUserInterests = async (userId: string, trx?: Trx) => {
		try {
			const connection = trx ? trx : pg
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

	return {
		getTags,
		findTakeOneOrThrow,
		findTakeOne,
		updateTakeOneOrThrow,
		deleteTakeOneOrThrow,
		createCommunityTags,
		getUserInterests,
		upsertUserInterests,
		createTags,
	}
}

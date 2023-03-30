import { Dependencies } from '@api/infra/diConfig'
import { PG } from '@api/infra/pg/createClient'
import {
	CommunityData,
	DeleteOptions,
	DeleteQuery,
	InsertableCommunity,
	InsertableMembership,
	SelectOptions,
	SelectQuery,
	Trx,
	UpdateOptions,
	UpdateQuery,
} from '@api/infra/pg/types'
import { AlreadyExists, NotFound } from '@api/utils/errors/baseError'
import {
	DBError,
	InvalidDeleteFilter,
	InvalidQueryFilter,
} from '@api/utils/errors/repoErrors'
import { NoResultError } from 'kysely'
import Pg from 'pg'

type CommunityDeleteQuery = DeleteQuery<'communities'>
type CommunityDeleteOptions = DeleteOptions<'communities'>
type CommunityUpdateQuery = UpdateQuery<'communities'>
type CommunityUpdateOptions = UpdateOptions<'communities'>
type CommunityQuery = SelectQuery<'communities'>
type CommunityQueryOptions = SelectOptions<'communities'>

export class CommunityRepository {
	private pg: PG

	constructor(deps: Dependencies) {
		this.pg = deps.pg
	}

	private findQuery(
		{ where }: CommunityQueryOptions,
		trx?: Trx,
	): CommunityQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.selectFrom('communities')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof CommunityData, '=', value)
		}

		return query
	}

	private removeQuery(
		{ where }: CommunityDeleteOptions,
		trx?: Trx,
	): CommunityDeleteQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidDeleteFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.deleteFrom('communities')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof CommunityData, '=', value)
		}

		return query
	}

	private updateQuery(
		{ where, data }: CommunityUpdateOptions,
		trx?: Trx,
	): CommunityUpdateQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidDeleteFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.updateTable('communities').set(data)

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof CommunityData, '=', value)
		}

		return query
	}

	async create(params: InsertableCommunity, trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			return await connection
				.insertInto('communities')
				.values(params)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				if (error.code === '23505') {
					throw new AlreadyExists({
						cause: error,
						message: 'Community already exists',
					})
				}
			}
			throw new DBError({ cause: error })
		}
	}

	async createMembership(params: InsertableMembership, trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			return await connection
				.insertInto('memberships')
				.values(params)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				if (error.code === '23505') {
					throw new AlreadyExists({
						cause: error,
						message: 'Membership already exists',
					})
				}
			}
			throw new DBError({ cause: error })
		}
	}

	async updateTakeOneOrThrow(
		options: CommunityUpdateOptions,
		trx?: Trx,
	): Promise<CommunityData> {
		try {
			return await this.updateQuery(options, trx)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Community not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	async findCommunityByIdOrThrow(
		id: string,
		trx?: Trx,
	): Promise<CommunityData> {
		try {
			return await this.findQuery({ where: { id } }, trx)
				.selectAll('communities')
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Community not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	async removeCommunityByIdOrThrow(
		id: string,
		trx?: Trx,
	): Promise<CommunityData> {
		try {
			return await this.removeQuery({ where: { id } }, trx)
				.returningAll('communities')
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Community not found' })
			}
			throw new DBError({ cause: error })
		}
	}
}

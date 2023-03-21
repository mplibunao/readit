import { Dependencies } from '@api/infra/diConfig'
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

export type CommunityRepository = ReturnType<typeof buildCommunityRepository>

export const buildCommunityRepository = ({ pg }: Dependencies) => {
	const del = (
		{ where }: CommunityDeleteOptions,
		trx?: Trx,
	): CommunityDeleteQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidDeleteFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.deleteFrom('communities')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof CommunityData, '=', value)
		}

		return query
	}

	const find = (
		{ where }: CommunityQueryOptions,
		trx?: Trx,
	): CommunityQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.selectFrom('communities')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof CommunityData, '=', value)
		}

		return query
	}

	const update = (
		{ where, data }: CommunityUpdateOptions,
		trx?: Trx,
	): CommunityUpdateQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.updateTable('communities').set(data)

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof CommunityData, '=', value)
		}

		return query
	}

	const findTakeOneOrThrow = async (
		options: CommunityQueryOptions,
		trx?: Trx,
	): Promise<CommunityData> => {
		try {
			return await find(options, trx).selectAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Community not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	const findTakeOne = async (
		options: CommunityQueryOptions,
		trx?: Trx,
	): Promise<CommunityData | undefined> => {
		try {
			return await find(options, trx).selectAll().executeTakeFirst()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	const updateTakeOneOrThrow = async (
		options: CommunityUpdateOptions,
		trx?: Trx,
	): Promise<CommunityData> => {
		try {
			return await update(options, trx).returningAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Community not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	const deleteTakeOneOrThrow = async (
		options: CommunityDeleteOptions,
		trx?: Trx,
	) => {
		try {
			return await del(options, trx).returningAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'Community not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	const create = async (params: InsertableCommunity, trx?: Trx) => {
		try {
			const connection = trx ? trx : pg
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

	const createMembership = async (params: InsertableMembership, trx?: Trx) => {
		try {
			const connection = trx ? trx : pg
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

	return {
		findTakeOneOrThrow,
		findTakeOne,
		updateTakeOneOrThrow,
		deleteTakeOneOrThrow,
		create,
		createMembership,
	}
}

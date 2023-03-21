import { Dependencies } from '@api/infra/diConfig'
import {
	DeleteOptions,
	DeleteQuery,
	InsertableSocialAccount,
	SelectOptions,
	SelectQuery,
	SocialAccountData,
	Trx,
	UpdateOptions,
	UpdateQuery,
} from '@api/infra/pg/types'
import {
	DBError,
	InvalidDeleteFilter,
	InvalidQueryFilter,
} from '@api/utils/errors/repoErrors'
import { NoResultError } from 'kysely'
import Pg from 'pg'

import {
	SocialAccountAlreadyExists,
	SocialAccountNotFound,
} from '../domain/oAuth.errors'

type SocialAccountDeleteQuery = DeleteQuery<'socialAccounts'>
type SocialAccountDeleteOptions = DeleteOptions<'socialAccounts'>
type SocialAccountUpdateQuery = UpdateQuery<'socialAccounts'>
type SocialAccountUpdateOptions = UpdateOptions<'socialAccounts'>
type SocialAccountQuery = SelectQuery<'socialAccounts'>
type SocialAccountFindOptions = SelectOptions<'socialAccounts'>

export type SocialAccountRepository = ReturnType<
	typeof buildSocialAccountRepository
>

export const buildSocialAccountRepository = ({ pg }: Dependencies) => {
	const del = (
		{ where }: SocialAccountDeleteOptions,
		trx?: Trx,
	): SocialAccountDeleteQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidDeleteFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.deleteFrom('socialAccounts')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof SocialAccountData, '=', value)
		}

		return query
	}

	const find = (
		{ where }: SocialAccountFindOptions,
		trx?: Trx,
	): SocialAccountQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.selectFrom('socialAccounts')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof SocialAccountData, '=', value)
		}

		return query
	}

	const update = (
		{ where, data }: SocialAccountUpdateOptions,
		trx?: Trx,
	): SocialAccountUpdateQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.updateTable('socialAccounts').set(data)

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof SocialAccountData, '=', value)
		}

		return query
	}

	const create = async (data: InsertableSocialAccount, trx?: Trx) => {
		try {
			const connection = trx ? trx : pg
			return await connection
				.insertInto('socialAccounts')
				.values(data)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				throw new SocialAccountAlreadyExists({})
			}
			throw new DBError({
				cause: error,
			})
		}
	}

	const findOneOrThrow = async (
		options: SocialAccountFindOptions,
		trx?: Trx,
	): Promise<SocialAccountData> => {
		try {
			return await find(options, trx).selectAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new SocialAccountNotFound({ cause: error })
			}
			throw new DBError({
				cause: error,
			})
		}
	}

	const findOne = async (
		options: SocialAccountFindOptions,
		trx?: Trx,
	): Promise<SocialAccountData | undefined> => {
		try {
			return await find(options, trx).selectAll().executeTakeFirst()
		} catch (error) {
			throw new DBError({
				cause: error,
			})
		}
	}

	const findBySocialId = async (socialId: string, trx?: Trx) => {
		try {
			return await find({ where: { socialId } }, trx)
				.innerJoin('users', 'socialAccounts.userId', 'users.id')
				.selectAll(['socialAccounts', 'users'])
				.executeTakeFirst()
		} catch (error) {
			throw new DBError({
				cause: error,
			})
		}
	}

	const updateTakeOneOrThrow = async (
		options: SocialAccountUpdateOptions,
		trx?: Trx,
	): Promise<SocialAccountData> => {
		try {
			return await update(options, trx).returningAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new SocialAccountNotFound({ cause: error })
			}
			throw new DBError({
				cause: error,
				message: 'Database error occurred while updating social account',
			})
		}
	}

	const deleteTakeOneOrThrow = async (id: string, trx?: Trx) => {
		try {
			return await del({ where: { id } }, trx)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new SocialAccountNotFound({ cause: error })
			}
			throw new DBError({
				cause: error,
			})
		}
	}

	return {
		findOne,
		findOneOrThrow,
		findBySocialId,
		updateTakeOneOrThrow,
		deleteTakeOneOrThrow,
		create,
	}
}

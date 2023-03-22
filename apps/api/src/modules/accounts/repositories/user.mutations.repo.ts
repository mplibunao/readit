import { Dependencies } from '@api/infra/diConfig'
import {
	InsertableUser,
	Trx,
	UserData,
	UpdateQuery,
	UpdateOptions,
} from '@api/infra/pg/types'
import { DBError, InvalidUpdateFilter } from '@api/utils/errors/repoErrors'
import { NoResultError } from 'kysely'
import Pg from 'pg'

import {
	UserAlreadyExists,
	UsernameAlreadyExists,
	UserNotFound,
} from '../domain/user.errors'

type UserUpdateQuery = UpdateQuery<'users'>

type UserUpdateOptions = UpdateOptions<'users'>

export type UserMutationsRepo = ReturnType<typeof buildUserMutationsRepo>

export const buildUserMutationsRepo = ({ pg }: Dependencies) => {
	const update = (
		{ where, data }: UserUpdateOptions,
		trx?: Trx,
	): UserUpdateQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidUpdateFilter({})
		}

		const connection = trx ? trx : pg
		let query = connection.updateTable('users').set(data)

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof UserData, '=', value)
		}

		return query
	}

	const updateTakeOne = async (
		options: UserUpdateOptions,
		trx?: Trx,
	): Promise<UserData | undefined> => {
		try {
			return await update(options, trx).returningAll().executeTakeFirst()
		} catch (error) {
			throw new DBError({
				cause: error,
			})
		}
	}

	const updateTakeOneOrThrow = async (
		options: UserUpdateOptions,
		trx?: Trx,
	): Promise<UserData> => {
		try {
			return await update(options, trx).returningAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new UserNotFound({ cause: error })
			}
			throw new DBError({
				cause: error,
			})
		}
	}

	const create = async (user: InsertableUser, trx?: Trx) => {
		try {
			const connection = trx ? trx : pg
			return await connection
				.insertInto('users')
				.values(user)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				if (error.code === '23505') {
					if (error.constraint === 'users_username_key') {
						throw new UsernameAlreadyExists({ cause: error })
					}
					throw new UserAlreadyExists({ cause: error })
				}
			}
			throw new DBError({
				cause: error,
			})
		}
	}

	return {
		updateTakeOne,
		create,
		updateTakeOneOrThrow,
	}
}

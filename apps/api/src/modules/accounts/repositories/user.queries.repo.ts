import { Dependencies } from '@api/infra/diConfig'
import { Trx, UserData } from '@api/infra/pg/types'
import { InvalidQueryFilter } from '@api/utils/errors/queryRepoErrors'
import { DB } from '@readit/pg-manager'
import { DBError } from '@readit/utils'
import { NoResultError, SelectQueryBuilder } from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'

import { UserNotFound } from '../domain/user.errors'

type FindOptions = {
	where: Partial<UserData>
}

type UserQuery = SelectQueryBuilder<From<DB, 'users'>, 'users', {}>
export interface UserQueriesRepo {
	findById: (id: string, trx?: Trx) => Promise<UserData>
	findByUsernameOrEmail: (
		params: { username: string } | { email: string },
		trx?: Trx,
	) => Promise<UserData>
}

export const buildUserQueriesRepo = ({ pg }: Dependencies) => {
	const find = ({ where }: FindOptions, trx?: Trx): UserQuery => {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		// Support transaction or non-transaction
		const connection = trx ? trx : pg
		let query = connection.selectFrom('users')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof UserData, '=', value)
		}

		return query
	}

	const findOne = async (
		options: FindOptions,
		trx?: Trx,
	): Promise<UserData> => {
		try {
			return await find(options, trx).selectAll().executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new UserNotFound({ cause: error })
			}
			throw new DBError({
				cause: error,
				message: 'Database error occurred while finding user',
			})
		}
	}

	const userQueriesRepo: UserQueriesRepo = {
		findById: (id, trx) => findOne({ where: { id } }, trx),
		findByUsernameOrEmail: (params, trx) => findOne({ where: params }, trx),
	}

	return userQueriesRepo
}

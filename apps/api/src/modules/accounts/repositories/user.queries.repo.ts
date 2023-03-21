import { Dependencies } from '@api/infra/diConfig'
import { SelectOptions, SelectQuery, Trx, UserData } from '@api/infra/pg/types'
import { DBError, InvalidQueryFilter } from '@api/utils/errors/repoErrors'
import { NoResultError, sql } from 'kysely'

import { OAuthSchemas } from '../domain/oAuth.schema'
import { UserNotFound } from '../domain/user.errors'

export type UserFindOptions = SelectOptions<'users'>
type UserQuery = SelectQuery<'users'>

export type UserQueriesRepo = ReturnType<typeof buildUserQueriesRepo>

export const buildUserQueriesRepo = ({ pg }: Dependencies) => {
	// const { ref } = pg.dynamic

	const find = ({ where }: UserFindOptions, trx?: Trx): UserQuery => {
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

		// if (select.length > 0) {
		// 	query.select(select.map((field) => ref<keyof UserTable>(field)))
		// }

		return query
	}

	const findOneOrThrow = async (
		options: UserFindOptions,
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
			})
		}
	}

	const findOne = async (
		options: UserFindOptions,
		trx?: Trx,
	): Promise<UserData | undefined> => {
		try {
			return await find(options, trx).selectAll().executeTakeFirst()
		} catch (error) {
			throw new DBError({
				cause: error,
			})
		}
	}

	const userQueriesRepo = {
		findOne,
		findOneOrThrow,
		findAccountStatus: async (id: string) => {
			try {
				const accountStatus = await pg
					.selectFrom('users')
					.where('users.id', '=', id)
					.leftJoin('socialAccounts as s', 's.userId', 'users.id')
					.selectAll('users')
					.select(
						sql<
							OAuthSchemas.SocialAccount[]
						>`COALESCE(json_agg(s.*) FILTER (WHERE s.id IS NOT NULL), '[]')`.as(
							'socialAccounts',
						),
					)
					.groupBy('users.id')
					.executeTakeFirstOrThrow()

				return accountStatus
			} catch (error) {
				if (error instanceof NoResultError) {
					throw new UserNotFound({ cause: error })
				}
				throw new DBError({
					cause: error,
				})
			}
		},
	}

	return userQueriesRepo
}

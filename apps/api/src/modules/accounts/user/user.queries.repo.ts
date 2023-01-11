import { Deps } from '@api/helpers/deps'
import { UserData } from '@api/infra/pg'
import { DBError } from '@readit/utils'
import { NoResultError } from 'kysely'
import { ResultAsync } from 'neverthrow'

import { UserNotFound } from './user.errors'

export * as UserQueriesRepo from './user.queries.repo'

export const findById = async ({ pg }: Deps, id: UserData['id']) => {
	return ResultAsync.fromPromise(
		pg
			.selectFrom('users')
			.selectAll('users')
			.where('id', '=', id)
			.executeTakeFirstOrThrow(),
		(err) => {
			if (err instanceof NoResultError) {
				return new UserNotFound({ cause: err })
			}
			return new DBError({
				cause: err,
				message: 'Database error occurred while finding user',
			})
		},
	)
}

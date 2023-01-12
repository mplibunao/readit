import { Deps } from '@api/helpers/deps'
import { UserData } from '@api/infra/pg'
import { DBError } from '@readit/utils'
import { NoResultError } from 'kysely'

import { UserNotFound } from './user.errors'

export * as UserQueriesRepo from './user.queries.repo'

export const findById = async (
	deps: Deps,
	id: UserData['id'],
): Promise<UserData> => {
	try {
		return deps.pg
			.selectFrom('users')
			.selectAll('users')
			.where('id', '=', id)
			.executeTakeFirstOrThrow()
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

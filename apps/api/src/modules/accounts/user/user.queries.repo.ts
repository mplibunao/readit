import { Dependencies } from '@api/infra/diConfig'
import { UserData } from '@api/infra/pg/types'
import { DBError } from '@readit/utils'
import { NoResultError } from 'kysely'

import { UserNotFound } from './user.errors'

export interface UserQueriesRepo {
	findById: (id: UserData['id']) => Promise<UserData>
}

export const buildUserQueriesRepo = (deps: Dependencies) => {
	const userQueriesRepo: UserQueriesRepo = {
		findById: async (id) => {
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
		},
	}

	return userQueriesRepo
}

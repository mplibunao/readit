import { Deps } from '@api/helpers/deps'
import { InsertableUser, UserData } from '@api/infra/pg'
import { DBError } from '@readit/utils'
import Pg from 'pg'

import { UserAlreadyExists } from './user.errors'

export * as UserMutationsRepo from './user.mutations.repo'

export const create = (
	deps: Deps,
	user: InsertableUser,
): Promise<Partial<UserData>> => {
	try {
		return deps.pg
			.insertInto('users')
			.values(user)
			.returning(['id', 'email', 'firstName', 'lastName'])
			.executeTakeFirstOrThrow()
	} catch (error) {
		if (error instanceof Pg.DatabaseError) {
			if (error.code === '23505') {
				throw new UserAlreadyExists({ cause: error })
			}
		}
		throw new DBError({
			cause: error,
			message: 'Database error occurred while creating user',
		})
	}
}

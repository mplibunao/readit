import { Dependencies } from '@api/infra/diConfig'
import { InsertableUser, UserData } from '@api/infra/pg/types'
import { DBError } from '@readit/utils'
import Pg from 'pg'

import { UserAlreadyExists } from '../domain/user.errors'

export interface UserMutationsRepo {
	create: (
		user: InsertableUser,
	) => Promise<Pick<UserData, 'id' | 'email' | 'firstName' | 'lastName'>>
}

export const buildUserMutationsRepo = (deps: Dependencies) => {
	const userMutationsRepo: UserMutationsRepo = {
		async create(user) {
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
		},
	}

	return userMutationsRepo
}

import { Deps } from '@api/helpers/deps'
import { InsertableUser, UserData } from '@api/infra/pg'
import { DBError } from '@readit/utils'
import { ResultAsync } from 'neverthrow'
import Pg from 'pg'

import { UserAlreadyExists } from './user.errors'

export * as UserMutationsRepo from './user.mutations.repo'

export const create = (
	{ pg, logger }: Deps,
	user: InsertableUser,
): ResultAsync<Partial<UserData>, DBError | UserAlreadyExists> => {
	return ResultAsync.fromPromise(
		pg
			.insertInto('users')
			.values(user)
			.returning(['id', 'email', 'firstName', 'lastName'])
			.executeTakeFirstOrThrow(),
		(error) => {
			const { hashedPassword: _, ...userData } = user
			if (error instanceof Pg.DatabaseError) {
				if (error.code === '23505') {
					logger.debug('User already exists', error, userData)
					return new UserAlreadyExists({ cause: error })
				}
			}

			logger.error(
				'Database error occurred while creating user',
				error,
				userData,
			)
			return new DBError({
				cause: error,
				message: 'Database error occurred while creating user',
			})
		},
	)
}

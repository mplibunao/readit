import { Deps } from '@api/helpers/deps'
import { InsertableUser } from '@api/infra/pg'
import { DBError } from '@readit/utils'
import { ResultAsync } from 'neverthrow'
import Pg from 'pg'

import { UserAlreadyExists } from './user.errors'
import { UserMapper } from './user.mapper'

export * as UserMutations from './user.mutations'

export const create = ({ pg, logger }: Deps, user: InsertableUser) => {
	return ResultAsync.fromPromise(
		pg
			.insertInto('users')
			.returning(['id', 'email', 'firstName', 'lastName'])
			.values(user)
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
	).map((user) => UserMapper.toDomain(user))
}

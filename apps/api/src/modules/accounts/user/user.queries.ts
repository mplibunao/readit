import { Deps } from '@api/helpers/deps'
import { UserData } from '@api/infra/pg'
import { DBError } from '@readit/utils'
import { NoResultError } from 'kysely'
import { ResultAsync } from 'neverthrow'

import { UserNotFound } from './user.errors'
import { UserMapper } from './user.mapper'

export * as UserQueries from './user.queries'

export const findById = async ({ pg }: Deps, id: UserData['id']) => {
	return ResultAsync.fromPromise(
		pg
			.selectFrom('users')
			.select([
				'id',
				'email',
				'firstName',
				'lastName',
				'deletedAt',
				'createdAt',
			])
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
	).map((user) => UserMapper.toDomain(user))
}

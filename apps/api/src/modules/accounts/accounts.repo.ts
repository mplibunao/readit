import { InsertableUser, PG, User } from '@/infra/pg'
import { ResultAsync } from 'neverthrow'
import { DatabaseError as DBError } from 'pg'
import { DatabaseError } from '@/helpers/errors'
import {
	FindUserByIdError,
	RegistrationError,
	UserAlreadyExists,
} from './accounts.errors'

export * as AccountsRepo from './accounts.repo'

export const create = (
	pg: PG,
	user: InsertableUser
): ResultAsync<Partial<User>, RegistrationError> => {
	return ResultAsync.fromPromise(
		pg
			.insertInto('users')
			.values(user)
			.returning(['id', 'email', 'firstName', 'lastName'])
			.executeTakeFirstOrThrow(),
		(error) => {
			if (error instanceof DBError) {
				if (error.code === '23505') {
					return new UserAlreadyExists(error)
				}
			}
			return new DatabaseError(error)
		}
	)
}

export const findUserById = (
	pg: PG,
	id: string
): ResultAsync<Partial<User>, FindUserByIdError> =>
	ResultAsync.fromPromise(
		pg
			.selectFrom('users')
			.select(['id', 'email', 'firstName', 'lastName', 'deactivatedAt'])
			.where('id', '=', id)
			.executeTakeFirstOrThrow(),
		(error) => new DatabaseError(error)
	)

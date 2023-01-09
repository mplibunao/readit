import { Deps } from '@api/helpers/deps'
import {
	DomainOutputValidationError,
	DomainValidationError,
} from '@readit/utils'
import argon2 from 'argon2'
import { err, Result, ResultAsync } from 'neverthrow'

import {
	FindByIdError,
	PasswordHashingError,
	RegistrationError,
} from './user.errors'
import { UserMutations } from './user.mutations'
import { UserQueries } from './user.queries'
import { FindByIdSchema, UserTypes } from './user.types'

export const register = async (
	deps: Deps,
	userInput: UserTypes.CreateUserSchema,
): Promise<Result<UserTypes.UserSchema, RegistrationError>> => {
	const validatedInput = await ResultAsync.fromPromise(
		UserTypes.createUserSchema.parseAsync(userInput),
		(err) =>
			new DomainValidationError({
				message: 'User Registration Failed. User details validation error',
				cause: err,
			}),
	)
	if (validatedInput.isErr()) return err(validatedInput.error)

	const { password, ...user } = validatedInput.value
	const hashedPassword = await ResultAsync.fromPromise(
		argon2.hash(password),
		(err) => {
			deps.logger.error('Password hashing failed', err, password, user)
			return new PasswordHashingError({
				cause: err,
			})
		},
	)
	if (hashedPassword.isErr()) return err(hashedPassword.error)

	const userResult = await UserMutations.create(deps, {
		...user,
		hashedPassword: hashedPassword.value,
	})
	if (userResult.isErr()) return err(userResult.error)

	return ResultAsync.fromPromise(
		UserTypes.userSchema.parseAsync(userResult.value),
		(err) =>
			new DomainOutputValidationError({
				cause: err,
				message: `Something went wrong. Invalid user domain output`,
			}),
	)
}

export const findUserById = async (
	deps: Deps,
	{ id }: FindByIdSchema,
): Promise<ResultAsync<UserTypes.UserSchema, FindByIdError>> => {
	const validatedInput = await ResultAsync.fromPromise(
		UserTypes.findByIdSchema.parseAsync(id),
		(err) =>
			new DomainValidationError({
				message: 'Failed to find user by id. Invalid ID',
				cause: err,
			}),
	)
	if (validatedInput.isErr()) return err(validatedInput.error)

	const userResult = await UserQueries.findById(deps, id)
	if (userResult.isErr()) {
		deps.logger.error('User was not found', userResult.error, id)
		return err(userResult.error)
	}

	return ResultAsync.fromPromise(
		UserTypes.userSchema.parseAsync(userResult.value),
		(err) =>
			new DomainOutputValidationError({
				cause: err,
				message: 'Invalid user domain output',
			}),
	)
}

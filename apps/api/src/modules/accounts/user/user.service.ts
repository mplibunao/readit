import { Deps } from '@api/helpers/deps'
import argon2 from 'argon2'
import { err, ok, Result, ResultAsync } from 'neverthrow'

import {
	FindByIdError,
	PasswordHashingError,
	RegistrationError,
} from './user.errors'
import { UserMutationsRepo } from './user.mutations.repo'
import { UserQueriesRepo } from './user.queries.repo'
import { FindByIdSchema, UserTypes } from './user.types'

export const register = async (
	deps: Deps,
	userInput: UserTypes.CreateUserInput,
): Promise<Result<UserTypes.CreateUserOutput, RegistrationError>> => {
	const validatedInput = UserTypes.createUserInput.parse(userInput)
	const { password, ...user } = validatedInput

	return ResultAsync.fromPromise(argon2.hash(password), (err) => {
		deps.logger.error('Password hashing failed', err, password, user)
		return new PasswordHashingError({
			cause: err,
			message: 'Registration failed',
		})
	})
		.map(async (hashedPassword) => {
			return UserMutationsRepo.create(deps, {
				...user,
				hashedPassword: hashedPassword,
			})
		})
		.map((user) => UserTypes.createUserOutput.parse(user))
}

export const findUserById = async (
	deps: Deps,
	id: FindByIdSchema,
): Promise<ResultAsync<UserTypes.UserSchema, FindByIdError>> => {
	const validatedInput = UserTypes.findByIdSchema.parse(id)

	const userResult = await UserQueriesRepo.findById(deps, validatedInput)
	if (userResult.isErr()) {
		deps.logger.error('User was not found', userResult.error, validatedInput)
		return err(userResult.error)
	}

	return ok(UserTypes.userSchema.parse(userResult.value))
}

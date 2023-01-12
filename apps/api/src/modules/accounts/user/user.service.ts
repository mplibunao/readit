import { Deps } from '@api/helpers/deps'
import { UserData } from '@api/infra/pg'
import { until } from '@open-draft/until'
import { DBError } from '@readit/utils'
import argon2 from 'argon2'

import { UserDomain } from './user.domain'
import {
	PasswordHashingError,
	UserAlreadyExists,
	UserNotFound,
} from './user.errors'
import { UserMutationsRepo } from './user.mutations.repo'
import { UserQueriesRepo } from './user.queries.repo'

export const register = async (
	deps: Deps,
	userInput: UserDomain.CreateUserInput,
): Promise<UserDomain.CreateUserOutput> => {
	const validatedInput = UserDomain.createUserInput.parse(userInput)
	const { password, ...user } = validatedInput

	const { error: hashingErr, data: hashedPassword } = await until<
		Error,
		string
	>(() => argon2.hash(password))

	if (hashingErr) {
		deps.logger.error('Hashing password failed', {
			password,
			error: hashingErr,
		})
		throw new PasswordHashingError({
			cause: hashingErr,
			message: 'Registration failed',
		})
	}

	const { error, data: createdUser } = await until<
		DBError | UserAlreadyExists,
		Partial<UserData>
	>(async () => {
		return UserMutationsRepo.create(deps, {
			...user,
			hashedPassword,
		})
	})

	if (error) {
		deps.logger.error('Failed to create user', { user, error })
		throw error
	}

	return UserDomain.createUserOutput.parse(createdUser)
}

export const findUserById = async (
	deps: Deps,
	id: UserDomain.FindByIdInput,
): Promise<UserDomain.UserSchema> => {
	const validatedInput = UserDomain.findByIdInput.parse(id)

	const { error, data } = await until<UserNotFound | DBError, UserData>(() =>
		UserQueriesRepo.findById(deps, validatedInput),
	)
	if (error) {
		deps.logger.error('User was not found', { id: validatedInput, error })
		throw error
	}

	return UserDomain.userSchema.parse(data)
}

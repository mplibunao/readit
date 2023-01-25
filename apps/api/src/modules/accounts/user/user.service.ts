import { Dependencies } from '@api/infra/diConfig'
import { UserData } from '@api/infra/pg/types'
import { until } from '@open-draft/until'
import { DBError } from '@readit/utils'
import argon2 from 'argon2'
import { z } from 'zod'

import {
	PasswordHashingError,
	UserAlreadyExists,
	UserNotFound,
} from './user.errors'
import { UserMutationsRepo } from './user.mutations.repo'
import { CreateUserOutput, User, UserSchema } from './user.types'

export interface UserService {
	register: (user: User.CreateUserInput) => CreateUserOutput
	findById: (id: string) => UserSchema
}

export const buildUserService = ({
	logger,
	UserMutationsRepo,
	UserQueriesRepo,
}: Dependencies): UserService => {
	return {
		register: z
			.function()
			.args(User.createUserInput)
			.returns(User.createUserOutput)
			.implement(async (input) => {
				const { password, ...user } = input

				const { error: hashingErr, data: hashedPassword } = await until<
					Error,
					string
				>(() => argon2.hash(password))

				if (hashingErr) {
					logger.error('Hashing password failed', {
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
					Awaited<ReturnType<UserMutationsRepo['create']>>
				>(async () => {
					return UserMutationsRepo.create({
						...user,
						hashedPassword,
					})
				})

				if (error) {
					logger.error('Failed to create user', { user, error })
					throw error
				}

				return createdUser
			}),

		findById: z
			.function()
			.args(User.findByIdInput)
			.returns(User.userSchema)
			.implement(async (id) => {
				const { error, data } = await until<UserNotFound | DBError, UserData>(
					() => UserQueriesRepo.findById(id),
				)
				if (!data || error) {
					logger.error('User was not found', { id, error })
					throw error
				}

				return data
			}),
	}
}

import { Dependencies } from '@api/infra/diConfig'
import { TokenData, UserData } from '@api/infra/pg/types'
import { until } from '@open-draft/until'
import { DBError, id } from '@readit/utils'
import argon2 from 'argon2'
import { z } from 'zod'

import { InvalidToken, TokenNotFound } from '../domain/token.errors'
import {
	FindByIdError,
	IncorrectPassword,
	PasswordHashingError,
	TokenAlreadyUsed,
	UserAlreadyConfirmed,
	UserAlreadyExists,
	UserNotFound,
} from '../domain/user.errors'
import { CreateUserOutput, UserSchemas } from '../domain/user.schema'
import { UserMutationsRepo } from '../repositories/user.mutations.repo'

export interface UserService {
	register: (user: UserSchemas.CreateUserInput) => Promise<CreateUserOutput>
	findById: (id: string) => Promise<UserSchemas.User>
	confirmEmail: (token: TokenData['id']) => Promise<'ok'>
	login: (params: UserSchemas.LoginInput) => Promise<void>
}

export const buildUserService = ({
	logger,
	UserMutationsRepo,
	UserQueriesRepo,
	SessionService,
	config,
	AccountEventsPublisher,
	TokenQueriesRepo,
	TokenMutationsRepo,
	pg,
}: Dependencies): UserService => {
	const register = z
		.function()
		.args(UserSchemas.createUserInput)
		.returns(z.promise(UserSchemas.createUserOutput))
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

			await AccountEventsPublisher.registerUser({
				userId: createdUser.id,
			})
			SessionService.setUser({ id: createdUser.id })

			return createdUser
		})

	const findById = z
		.function()
		.args(UserSchemas.findByIdInput)
		.returns(z.promise(UserSchemas.user))
		.implement(async (id) => {
			const { error, data } = await until<FindByIdError, UserData>(() =>
				UserQueriesRepo.findById(id),
			)
			if (!data || error) {
				logger.error('User was not found', { id, error })
				throw error
			}

			return data
		})

	const confirmEmail = z
		.function()
		.args(id)
		.returns(z.promise(z.literal('ok')))
		.implement(async (id) => {
			const { data: token, error: tokenError } = await until<
				DBError | TokenNotFound | InvalidToken | TokenAlreadyUsed,
				TokenData
			>(async () => {
				const token = await TokenQueriesRepo.findById(id)
				if (token.type !== 'accountActivation')
					throw new InvalidToken({ message: 'Invalid token type' })
				if (token.usedAt)
					throw new TokenAlreadyUsed({ message: 'Token already used' })
				return token
			})

			if (tokenError) {
				logger.error('Email confirm failed. Invalid Token', {
					id,
					error: tokenError,
				})
				throw tokenError
			}

			const { error } = await until<FindByIdError | UserAlreadyConfirmed, void>(
				async () => {
					const user = await findById(token.userId)
					if (user.confirmedAt) throw new UserAlreadyConfirmed({})
					await pg.transaction().execute(async (trx) => {
						await UserMutationsRepo.confirmUser(user.id, trx)
						await TokenMutationsRepo.markAsUsed(token.id, trx)
					})
				},
			)

			if (error) {
				logger.error('Email confirm failed. Marking token as used failed', {
					token,
					error,
				})
				throw error
			}

			return 'ok' as const
		})

	const login = z
		.function()
		.args(UserSchemas.loginInput)
		.returns(z.promise(z.void()))
		.implement(async ({ usernameOrEmail, password }) => {
			const { data: user, error: getUserError } = await until<
				UserNotFound | DBError,
				UserData
			>(() => {
				const isEmail = UserSchemas.email.safeParse(usernameOrEmail)
				const filter = isEmail.success
					? { email: usernameOrEmail }
					: { username: usernameOrEmail }
				return UserQueriesRepo.findByUsernameOrEmail(filter)
			})

			if (getUserError) {
				logger.error('Login failed. Failed to get user', {
					usernameOrEmail,
					error: getUserError,
				})
				throw getUserError
			}

			const { error: passwordValidationError, data: passwordValid } =
				await until<Error, boolean>(() =>
					argon2.verify(user.hashedPassword, password),
				)

			if (passwordValidationError) {
				logger.error('Login failed. Failed to verify password', {
					usernameOrEmail,
					error: getUserError,
				})
				throw passwordValidationError
			}
			if (!passwordValid) throw new IncorrectPassword({})
		})

	/*
	 * if username query user by username
	 * if email query user by username
	 * throw user not found
	 * verify password using argon2.verfify(user.password, password)
	 * throw invalid password
	 * Create token type login
	 * Publish message to pubsub
	 */

	//})

	return {
		register,
		findById,
		confirmEmail,
		login,
	}
}

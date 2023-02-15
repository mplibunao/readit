import { Dependencies } from '@api/infra/diConfig'
import { TokenData } from '@api/infra/pg/types'
import { Session } from '@api/infra/session'
import { id } from '@readit/utils'
import argon2 from 'argon2'
import { z } from 'zod'

import { InvalidToken } from '../domain/token.errors'
import {
	IncorrectPassword,
	TokenAlreadyExpired,
	TokenAlreadyUsed,
	UserAlreadyConfirmed,
} from '../domain/user.errors'
import { CreateUserOutput, UserSchemas } from '../domain/user.schema'

export interface UserService {
	register: (params: {
		input: UserSchemas.CreateUserInput
		session: Session
	}) => Promise<CreateUserOutput>
	findById: (id: string) => Promise<UserSchemas.User>
	confirmEmail: (token: TokenData['id']) => Promise<void>
	login: (params: UserSchemas.LoginInput) => Promise<void>
	verifyLoginToken: (params: {
		id: TokenData['id']
		session: Session
	}) => Promise<'ok'>
}

export const buildUserService = ({
	logger,
	UserMutationsRepo,
	UserQueriesRepo,
	AccountEventsPublisher,
	TokenQueriesRepo,
	TokenMutationsRepo,
	pg,
}: Dependencies): UserService => {
	const register: UserService['register'] = async ({ input, session }) => {
		UserSchemas.createUserInput.parse(input)
		const { password, ...user } = input
		try {
			const hashedPassword = await argon2.hash(password)

			const createdUser = await UserMutationsRepo.create({
				...user,
				hashedPassword,
			})

			await AccountEventsPublisher.registerUser({
				userId: createdUser.id,
			})
			session.user = { id: createdUser.id }

			return UserSchemas.createUserOutput.parse(createdUser)
		} catch (error) {
			logger.error({ user, error }, 'Failed to create user')
			throw error
		}
	}

	const findById = z
		.function()
		.args(UserSchemas.findByIdInput)
		.returns(z.promise(UserSchemas.user))
		.implement(async (id) => {
			try {
				return await UserQueriesRepo.findById(id)
			} catch (error) {
				logger.error({ id, error }, 'User was not found')
				throw error
			}
		})

	const confirmEmail = z
		.function()
		.args(id)
		.returns(z.promise(z.void()))
		.implement(async (id) => {
			try {
				const token = await TokenQueriesRepo.findById(id)
				if (token.type !== 'accountActivation') {
					throw new InvalidToken({ message: 'Invalid token type' })
				}
				if (token.usedAt) {
					throw new TokenAlreadyUsed({ message: 'Token already used' })
				}

				const user = await findById(token.userId)
				if (user.confirmedAt) throw new UserAlreadyConfirmed({})

				await pg.transaction().execute(async (trx) => {
					await UserMutationsRepo.confirmUser(user.id, trx)
					await TokenMutationsRepo.markAsUsed(token.id, trx)
				})
			} catch (error) {
				logger.error({ error }, 'Email confirm failed.')
			}
		})

	const login = z
		.function()
		.args(UserSchemas.loginInput)
		.returns(z.promise(z.void()))
		.implement(async ({ usernameOrEmail, password }) => {
			try {
				const isEmail = UserSchemas.email.safeParse(usernameOrEmail)
				const filter = isEmail.success
					? { email: usernameOrEmail }
					: { username: usernameOrEmail }
				const user = await UserQueriesRepo.findByUsernameOrEmail(filter)

				const passwordValid = await argon2.verify(user.hashedPassword, password)
				if (!passwordValid) throw new IncorrectPassword({})

				await AccountEventsPublisher.loginBasicAuth({ userId: user.id })
			} catch (error) {
				logger.error({ usernameOrEmail, error }, 'Login failed')
				throw error
			}
		})

	return {
		register,
		findById,
		confirmEmail,
		login,
		verifyLoginToken: async ({ id, session }) => {
			try {
				const token = await TokenQueriesRepo.findById(id)
				if (token.type !== 'login') {
					throw new InvalidToken({ message: 'Invalid token type' })
				}
				if (token.usedAt) {
					throw new TokenAlreadyUsed({ message: 'Token already used' })
				}
				if (token.expiresAt && new Date() >= token.expiresAt) {
					throw new TokenAlreadyExpired({ message: 'Token already expired' })
				}
				await TokenMutationsRepo.markAsUsed(token.id)
				session.user = { id: token.userId }
				return 'ok'
			} catch (error) {
				logger.error({ id, error: error }, 'Login token validation failed')
				throw error
			}
		},
	}
}

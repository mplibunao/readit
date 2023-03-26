import { Dependencies } from '@api/infra/diConfig'
import { Session } from '@api/infra/session'
import { AppError, InternalServerError } from '@api/utils/errors/baseError'
import { email, id } from '@readit/utils'
import argon2 from 'argon2'
import { sql } from 'kysely'
import { z } from 'zod'

import { InvalidToken } from '../domain/token.errors'
import {
	EmailAlreadyTaken,
	InvalidCredentials,
	InvalidPassword,
	NoPasswordConfigured,
	UserAlreadyConfirmed,
	UserAlreadyExists,
	UserNotFound,
} from '../domain/user.errors'
import { UserSchemas } from '../domain/user.schema'

export type AuthService = ReturnType<typeof buildAuthService>

export const buildAuthService = ({
	UserQueriesRepo,
	logger,
	UserMutationsRepo,
	AccountEventsPublisher,
	TokenService,
	UserService,
}: Dependencies) => {
	const register = async ({
		input,
		session,
	}: {
		input: UserSchemas.CreateUserInput
		session: Session
	}) => {
		UserSchemas.createUserInput.parse(input)
		const { password, ...user } = input
		try {
			const userByEmail = await UserQueriesRepo.findOne({
				where: { email: user.email },
			})
			if (userByEmail) {
				logger.error(
					{ ...userByEmail, email: user.email },
					'User with email already exists',
				)
				throw new UserAlreadyExists({})
			}

			const hashedPassword = await argon2.hash(password)

			const createdUser = await UserMutationsRepo.create({
				...user,
				hashedPassword,
			})

			await AccountEventsPublisher.registerUser({
				userId: createdUser.id,
			})

			session.user = { id: createdUser.id }

			return UserSchemas.user.parse(createdUser)
		} catch (error) {
			if (error instanceof AppError) {
				logger.error({ user, error }, `Failed to create user: ${error.type}`)
				throw error
			}
			logger.error({ user, error }, 'Failed to create user')
			throw new InternalServerError({ cause: error })
		}
	}

	const login = z
		.function()
		.args(UserSchemas.loginInput)
		.returns(z.promise(z.void()))
		.implement(async ({ usernameOrEmail, password }) => {
			try {
				const isEmail = email.safeParse(usernameOrEmail)
				const filter = isEmail.success
					? { email: usernameOrEmail }
					: { username: usernameOrEmail }
				const user = await UserQueriesRepo.findOneOrThrow({ where: filter })

				if (!user.hashedPassword) {
					throw new NoPasswordConfigured({})
				}
				const passwordValid = await argon2.verify(user.hashedPassword, password)
				if (!passwordValid) throw new InvalidPassword({})

				await AccountEventsPublisher.loginBasicAuth({ userId: user.id })
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ usernameOrEmail, error },
						`Login failed: ${error.type}`,
					)

					switch (error.constructor) {
						case UserNotFound:
						case InvalidPassword:
							throw new InvalidCredentials({ cause: error, type: error.type })
						default:
							throw error
					}
				}

				logger.error({ usernameOrEmail, error }, `Login failed`)
				throw new InternalServerError({ cause: error })
			}
		})

	const verifyLoginToken = async ({
		id,
		session,
	}: {
		id: string
		session: Session
	}): Promise<'ok'> => {
		try {
			const token = await TokenService.get(id)
			if (token.type !== 'login') {
				throw new InvalidToken({
					message: 'Only tokens for logging in using credentials can be used',
				})
			}
			await TokenService.del(id)
			session.user = { id: token.userId }
			return 'ok'
		} catch (error) {
			if (error instanceof AppError) {
				logger.error(
					{ id, error },
					`Login token validation failed: ${error.type}`,
				)
				throw error
			}
			logger.error({ id, error }, 'Login token validation failed')
			throw new InternalServerError({ cause: error })
		}
	}

	const confirmEmail = z
		.function()
		.args(id)
		.returns(z.promise(z.void()))
		.implement(async (id) => {
			try {
				const token = await TokenService.get(id)
				if (token.type !== 'accountActivation') {
					throw new InvalidToken({
						message: 'Only tokens for email confirmation can be used',
					})
				}

				const user = await UserService.findById(token.userId)
				if (user.confirmedAt) throw new UserAlreadyConfirmed({})

				await TokenService.del(token.id)
				await UserMutationsRepo.updateTakeOneOrThrow({
					where: { id: user.id },
					data: { confirmedAt: 'NOW()' },
				})
			} catch (error) {
				if (error instanceof AppError) {
					logger.error({ error }, `Email confirm failed: ${error.type}`)
					throw error
				}
				logger.error({ error }, 'Email confirm failed')
				throw new InternalServerError({ cause: error })
			}
		})

	const changePassword = z
		.function()
		.args(UserSchemas.changePasswordInput)
		.returns(z.promise(z.void()))
		.implement(async ({ oldPassword, newPassword, userId }) => {
			try {
				const user = await UserQueriesRepo.findOneOrThrow({
					where: { id: userId },
				})

				if (user.hashedPassword && oldPassword) {
					const oldPasswordValid = await argon2.verify(
						user.hashedPassword,
						oldPassword,
					)
					if (!oldPasswordValid) {
						throw new InvalidPassword({
							message: 'Old password entered is invalid',
						})
					}
				}

				const hashedPassword = await argon2.hash(newPassword)
				await UserMutationsRepo.updateTakeOneOrThrow({
					where: { id: userId },
					data: { hashedPassword },
				})
			} catch (error) {
				if (error instanceof AppError) {
					logger.error({ error }, `Error changing password: ${error.type}`)
					throw error
				}
				logger.error({ error }, 'Error changing password')
				throw new InternalServerError({ cause: error })
			}
		})

	const requestChangeEmail = z
		.function()
		.args(UserSchemas.requestChangeEmailInput)
		.returns(z.promise(z.string()))
		.implement(async (params) => {
			try {
				const { userId, newEmail } = params
				const user = await UserQueriesRepo.findOne({ where: { id: userId } })
				if (!user) throw new UserNotFound({})
				if (user && user.email === newEmail) {
					throw new EmailAlreadyTaken({
						message: 'New email cannot be the same as the old one',
					})
				}

				const userWithNewEmail = await UserQueriesRepo.findOne({
					where: { email: newEmail },
				})
				if (userWithNewEmail) {
					throw new EmailAlreadyTaken({
						message: 'The email you are trying to choose is already taken',
					})
				}

				if (params.hasPassword && user?.hashedPassword) {
					const validPassword = await argon2.verify(
						user.hashedPassword,
						params.password,
					)
					if (!validPassword) {
						throw new InvalidPassword({
							message: 'Password entered is invalid',
						})
					}
				}

				return await AccountEventsPublisher.changeEmail({
					userId: user.id,
					newEmail: params.newEmail,
				})
			} catch (error) {
				if (error instanceof AppError) {
					logger.error({ error }, `Error changing email: ${error.type}`)
					throw error
				}
				logger.error({ error }, 'Error changing email')
				throw new InternalServerError({ cause: error })
			}
		})

	const changeEmail = async ({
		newEmail,
		tokenId,
		session,
	}: {
		newEmail: string
		tokenId: string
		session: Session
	}) => {
		try {
			const token = await TokenService.get(tokenId)
			if (token.type !== 'emailChange') {
				throw new InvalidToken({
					message: 'Only tokens for changing account email can be used',
				})
			}
			const userByEmail = await UserQueriesRepo.findOne({
				where: { email: newEmail },
			})
			if (userByEmail) {
				throw new EmailAlreadyTaken({})
			}

			const user = await UserService.findById(token.userId)
			await TokenService.del(tokenId)
			await UserMutationsRepo.updateTakeOneOrThrow({
				where: { id: user.id },
				data: { email: newEmail },
			})

			session.user = { id: user.id }

			return 'ok'
		} catch (error) {
			if (error instanceof AppError) {
				logger.error({ id, error }, `Change email failed: ${error.type}`)
				throw error
			}
			logger.error({ id, error }, 'Change email failed')
			throw new InternalServerError({ cause: error })
		}
	}

	const forgotPassword = z
		.function()
		.args(UserSchemas.forgotPasswordInput)
		.implement(async (filter) => {
			try {
				const user = await UserQueriesRepo.findOneOrThrow({ where: filter })
				return await AccountEventsPublisher.forgotPassword({ userId: user.id })
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ error },
						`Error requesting forgot password: ${error.type}`,
					)
					throw error
				}
				logger.error({ error }, 'Error requesting forgot password')
				throw new InternalServerError({ cause: error })
			}
		})

	const resetPassword = async (
		{ token, newPassword }: UserSchemas.ResetPasswordInput,
		session: Session,
	) => {
		try {
			const tokenData = await TokenService.get(token)
			if (tokenData.type !== 'passwordReset') {
				throw new InvalidToken({
					message: 'Only tokens for resetting password can be used',
				})
			}
			const hashedPassword = await argon2.hash(newPassword)
			await UserMutationsRepo.updateTakeOneOrThrow({
				where: { id: tokenData.userId },
				data: { hashedPassword },
			})
			await TokenService.del(token)
			session.user = { id: tokenData.userId }
			return 'ok'
		} catch (error) {
			if (error instanceof AppError) {
				logger.error({ error }, `Error resetting password: ${error.type}`)
				throw error
			}
			logger.error({ error }, 'Error resetting password')
			throw new InternalServerError({ cause: error })
		}
	}

	return {
		register,
		login,
		confirmEmail,
		verifyLoginToken,
		changePassword,
		changeEmail,
		requestChangeEmail,
		forgotPassword,
		resetPassword,
	}
}

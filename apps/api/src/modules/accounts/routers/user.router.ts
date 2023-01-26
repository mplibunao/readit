import { UserDto } from '@api/modules/accounts/domain/user.dto'
import { publicProcedure, router } from '@api/trpc/builder'
import { until } from '@open-draft/until'
import { AppError, DBError } from '@readit/utils'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'

import {
	FindByIdError,
	PasswordHashingError,
	RegistrationError,
	UserAlreadyExists,
	UserNotFound,
} from '../domain/user.errors'
import { User } from '../domain/user.types'

export const userRouter = router({
	register: publicProcedure
		.input(UserDto.registerInput)
		.output(UserDto.registerOutput)
		.mutation(async ({ input, ctx: { UserService, logger } }) => {
			const { data, error } = await until<
				RegistrationError,
				Awaited<User.CreateUserOutput>
			>(() => UserService.register(input))

			if (error) {
				if (error instanceof ZodError) {
					logger.debug('Zod error', error)
					throw new TRPCError({
						code: 'BAD_REQUEST',
						cause: error,
						message: error.message,
					})
				}

				if (error instanceof AppError) {
					switch (error.constructor) {
						case UserAlreadyExists:
							throw new TRPCError({ ...error, code: 'CONFLICT' })
						case DBError:
						case PasswordHashingError:
						default:
							logger.error('Error creating user', error)
							throw new TRPCError({ ...error, code: 'INTERNAL_SERVER_ERROR' })
					}
				}

				throw new TRPCError({
					cause: error,
					message: 'Unhandled exception',
					code: 'INTERNAL_SERVER_ERROR',
				})
			}

			return data
		}),
	byId: publicProcedure
		.input(UserDto.userByIdInput)
		.output(UserDto.userByIdOutput)
		.query(async ({ input, ctx: { UserService, logger } }) => {
			const { error, data } = await until<
				FindByIdError,
				Awaited<User.UserSchema>
			>(() => UserService.findById(input.id))

			if (error) {
				if (error instanceof ZodError) {
					logger.debug('Zod error', error)
					throw new TRPCError({
						code: 'BAD_REQUEST',
						cause: error,
						message: error.message,
					})
				}

				if (error instanceof AppError) {
					switch (error.constructor) {
						case UserNotFound:
							throw new TRPCError({ ...error, code: 'NOT_FOUND' })
						case DBError:
						default:
							throw new TRPCError({ ...error, code: 'INTERNAL_SERVER_ERROR' })
					}
				}

				console.log('error', error) // eslint-disable-line no-console
				throw new TRPCError({
					cause: error,
					message: 'Unhandled exception',
					code: 'INTERNAL_SERVER_ERROR',
				})
			}

			return data
		}),
})

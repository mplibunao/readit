import { deps } from '@api/helpers/deps'
import { AccountsService } from '@api/modules/accounts'
import { UserDto } from '@api/modules/accounts/user/user.dto'
import { publicProcedure, router } from '@api/trpc/builder'
import { until } from '@open-draft/until'
import { AppError, DBError } from '@readit/utils'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'

import { UserDomain } from './user.domain'
import {
	FindByIdError,
	PasswordHashingError,
	RegistrationError,
	UserAlreadyExists,
	UserNotFound,
} from './user.errors'

export const userRouter = router({
	register: publicProcedure
		.input(UserDto.registerInput)
		.output(UserDto.registerOutput)
		.query(async ({ input }) => {
			const { data, error } = await until<
				RegistrationError,
				UserDomain.CreateUserOutput
			>(() => AccountsService.register(deps, input))

			if (error) {
				if (error instanceof ZodError) {
					deps.logger.debug('Zod error', error)
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
							deps.logger.error('Error creating user', error)
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
		.query(async ({ input }) => {
			const { error, data } = await until<FindByIdError, UserDomain.UserSchema>(
				() => AccountsService.findUserById(deps, input.id),
			)

			if (error) {
				if (error instanceof ZodError) {
					deps.logger.debug('Zod error', error)
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

				throw new TRPCError({
					cause: error,
					message: 'Unhandled exception',
					code: 'INTERNAL_SERVER_ERROR',
				})
			}

			return data
		}),
})

import { AccountsService } from '@api/modules/accounts'
import { UserDto } from '@api/modules/accounts/user/user.dto'
import { publicProcedure, router } from '@api/trpc/trpc'
import { AppError, DBError } from '@readit/utils'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'

import {
	PasswordHashingError,
	UserAlreadyExists,
	UserNotFound,
} from './user.errors'

export const userRouter = router({
	register: publicProcedure
		.input(UserDto.registerInput)
		.output(UserDto.registerOutput)
		.query(async ({ ctx, input }) => {
			try {
				const userResult = await AccountsService.register(ctx.deps, input)

				return userResult.match(
					(user) => user,
					(err) => {
						if (err instanceof AppError) {
							switch (err.constructor) {
								case UserAlreadyExists:
									throw new TRPCError({ ...err, code: 'CONFLICT' })
								case DBError:
								case PasswordHashingError:
								default:
									ctx.deps.logger.error('Error creating user', err)
									throw new TRPCError({ ...err, code: 'INTERNAL_SERVER_ERROR' })
							}
						}
						throw new TRPCError({
							cause: err,
							message: 'Unhandled exception',
							code: 'INTERNAL_SERVER_ERROR',
						})
					},
				)
			} catch (error) {
				if (error instanceof ZodError) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						cause: error,
						message: error.message,
					})
				}
				throw error
			}
		}),
	byId: publicProcedure
		.input(UserDto.userByIdInput)
		.output(UserDto.userByIdOutput)
		.query(async ({ ctx, input }) => {
			try {
				const userResult = await AccountsService.findUserById(
					ctx.deps,
					input.id,
				)

				return userResult.match(
					(user) => user,
					(err) => {
						if (err instanceof AppError) {
							switch (err.constructor) {
								case UserNotFound:
									throw new TRPCError({ ...err, code: 'NOT_FOUND' })
								case DBError:
								default:
									throw new TRPCError({ ...err, code: 'INTERNAL_SERVER_ERROR' })
							}
						} else {
							throw new TRPCError({
								cause: err,
								message: 'Unhandled exception',
								code: 'INTERNAL_SERVER_ERROR',
							})
						}
					},
				)
			} catch (error) {
				if (error instanceof ZodError) {
					throw new TRPCError({
						code: 'BAD_REQUEST',
						cause: error,
						message: error.message,
					})
				}
				throw error
			}
		}),
})

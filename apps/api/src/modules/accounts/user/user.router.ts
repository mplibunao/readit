import { AccountsService } from '@api/modules/accounts'
import { UserDto } from '@api/modules/accounts/user/user.dto'
import { UserAlreadyExists } from '@api/temp/accounts.errors'
import { publicProcedure, router } from '@api/trpc/trpc'
import {
	AppError,
	DBError,
	DomainOutputValidationError,
	DomainValidationError,
} from '@readit/utils'
import { TRPCError } from '@trpc/server'

import { PasswordHashingError, UserNotFound } from './user.errors'

export const userRouter = router({
	register: publicProcedure
		.input(UserDto.registerInput)
		.output(UserDto.registerOutput)
		.query(async ({ ctx, input }) => {
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
							case DomainValidationError:
							case DomainOutputValidationError:
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
		}),
	byId: publicProcedure
		.input(UserDto.userByIdInput)
		.output(UserDto.userByIdOutput)
		.query(async ({ ctx, input }) => {
			const userResult = await AccountsService.findUserById(ctx.deps, input)

			return userResult.match(
				(user) => user,
				(err) => {
					if (err instanceof AppError) {
						switch (err.constructor) {
							case UserNotFound:
								throw new TRPCError({ ...err, code: 'NOT_FOUND' })
							case DBError:
							case DomainValidationError:
							case DomainOutputValidationError:
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
		}),
})

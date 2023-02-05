import {
	PasswordHashingError,
	UserAlreadyExists,
	UserNotFound,
} from '@api/modules/accounts/domain/user.errors'
import { Logger } from '@readit/logger'
import { AppError, DBError } from '@readit/utils'
import { TRPCError } from '@trpc/server'
import { ZodError } from 'zod'

import { InvalidQueryFilter } from './queryRepoErrors'

export const handleTRPCServiceErrors = (
	error: unknown,
	logger: Logger,
): TRPCError => {
	if (error instanceof ZodError) {
		return new TRPCError({
			code: 'BAD_REQUEST',
			cause: error,
			message: error.message,
		})
	}

	if (error instanceof AppError) {
		switch (error.constructor) {
			case InvalidQueryFilter:
				return new TRPCError({ ...error, code: 'BAD_REQUEST' })
			case UserNotFound:
				return new TRPCError({ ...error, code: 'NOT_FOUND' })
			case UserAlreadyExists:
				return new TRPCError({ ...error, code: 'CONFLICT' })
			case DBError:
			case PasswordHashingError:
			default:
				logger.error('Internal Server Error', error)
				return new TRPCError({ ...error, code: 'INTERNAL_SERVER_ERROR' })
		}
	}

	return new TRPCError({
		cause: error,
		message: 'Unhandled exception',
		code: 'INTERNAL_SERVER_ERROR',
	})
}

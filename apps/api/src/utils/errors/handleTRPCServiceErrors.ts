import {
	InvalidToken,
	TokenNotFound,
} from '@api/modules/accounts/domain/token.errors'
import {
	IncorrectPassword,
	TokenAlreadyExpired,
	TokenAlreadyUsed,
	UserAlreadyConfirmed,
	UserAlreadyExists,
	UserNotFound,
} from '@api/modules/accounts/domain/user.errors'
import { Logger } from '@readit/logger'
import { AppError, DBError } from '@readit/utils'
import { TRPCError } from '@trpc/server'
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/dist/rpc'
import { ZodError } from 'zod'

import { InvalidQueryFilter } from './queryRepoErrors'

/*
 *Adds type to TRPCError so we can send it back to the frontend and match it to the ErrorClass.type
 */
export class TrpcError extends TRPCError {
	public readonly type: string

	constructor({
		code,
		cause,
		message,
		type,
	}: {
		message?: string
		code: TRPC_ERROR_CODE_KEY
		cause?: unknown
		type: string
	}) {
		super({ code, cause, message })
		this.type = type
	}
}

export const handleTRPCServiceErrors = (
	error: unknown,
	_logger: Logger,
): TrpcError | TRPCError => {
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
			case IncorrectPassword:
			case InvalidToken:
				return new TrpcError({ ...error, code: 'BAD_REQUEST' }) // 400
			case TokenNotFound:
			case UserNotFound:
				return new TrpcError({ ...error, code: 'NOT_FOUND' }) // 404
			case UserAlreadyExists:
			case UserAlreadyConfirmed:
			case TokenAlreadyUsed:
			case TokenAlreadyExpired:
				return new TrpcError({ ...error, code: 'CONFLICT' }) // 409
			case DBError:
			default:
				return new TrpcError({ ...error, code: 'INTERNAL_SERVER_ERROR' })
		}
	}

	return new TRPCError({
		cause: error,
		message: 'Unhandled exception',
		code: 'INTERNAL_SERVER_ERROR',
	})
}

import {
	SocialAccountAlreadyExists,
	SocialAccountNotFound,
	SocialNotOwnedByUser,
} from '@api/modules/accounts/domain/oAuth.errors'
import {
	InvalidToken,
	TokenNotFound,
} from '@api/modules/accounts/domain/token.errors'
import {
	InvalidCredentials,
	NoPasswordConfigured,
	UserAlreadyConfirmed,
	UserAlreadyExists,
	UsernameAlreadyExists,
	UserNotFound,
} from '@api/modules/accounts/domain/user.errors'
import { Logger } from '@readit/logger'
import { TRPCError } from '@trpc/server'
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/dist/rpc'
import { ZodError } from 'zod'

import {
	AppError,
	InternalServerError,
	UnauthorizedError,
	NotFound,
	AlreadyExists,
} from './baseError'
import { VALIDATION_ERROR_TYPE } from './errorTypes'
import {
	InvalidDeleteFilter,
	DBError,
	InvalidQueryFilter,
	InvalidUpdateFilter,
} from './repoErrors'

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
	logger: Logger,
): TrpcError | TRPCError => {
	if (error instanceof ZodError) {
		return new TrpcError({
			type: VALIDATION_ERROR_TYPE,
			code: 'BAD_REQUEST',
			cause: error,
			message: error.cause as string,
		})
	}

	if (error instanceof AppError) {
		switch (error.constructor) {
			// 400
			case InvalidQueryFilter:
			case InvalidToken:
			case InvalidUpdateFilter:
			case InvalidDeleteFilter:
			case SocialNotOwnedByUser:
				return new TrpcError({
					...error,
					cause: error,
					code: 'BAD_REQUEST',
					message: error.message,
				})
			// 401
			case UnauthorizedError:
			case InvalidCredentials:
				return new TrpcError({
					...error,
					cause: error,
					code: 'UNAUTHORIZED',
					message: error.message,
				})

			// 403 - logged in but not enough permissions
			case SocialNotOwnedByUser:
				return new TrpcError({
					...error,
					cause: error,
					code: 'FORBIDDEN',
					message: error.message,
				})
			// 404
			case TokenNotFound:
			case UserNotFound:
			case NotFound:
			case SocialAccountNotFound:
				return new TrpcError({
					...error,
					code: 'NOT_FOUND',
					cause: error,
					message: error.message,
				})
			// 409
			case UserAlreadyConfirmed:
			case UsernameAlreadyExists:
			case UserAlreadyExists:
			case AlreadyExists:
			case SocialAccountAlreadyExists:
			case NoPasswordConfigured:
				return new TrpcError({
					...error,
					code: 'CONFLICT',
					cause: error,
					message: error.message,
				})
			// 500
			case DBError:
			default:
				return new TrpcError({
					...error,
					code: 'INTERNAL_SERVER_ERROR',
					cause: error,
					message: error.message,
				})
		}
	}

	if (error instanceof TRPCError) {
		return error
	}

	logger.error(error, 'Internal Server Error')
	return new TRPCError({
		cause: error,
		message: InternalServerError.message,
		code: 'INTERNAL_SERVER_ERROR',
	})
}

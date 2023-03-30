import { SocialAccountAlreadyExists } from '@api/modules/accounts/domain/oAuth.errors'
import {
	InvalidToken,
	TokenNotFound,
} from '@api/modules/accounts/domain/token.errors'
import {
	UserAlreadyConfirmed,
	UserAlreadyExists,
	UsernameAlreadyExists,
	InvalidCredentials,
	NoPasswordConfigured,
} from '@api/modules/accounts/domain/user.errors'
import { Logger } from '@readit/logger'
import createError from 'http-errors'
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
	InvalidQueryFilter,
	InvalidUpdateFilter,
	InvalidDeleteFilter,
} from './repoErrors'

export const handleRESTServiceErrors = (
	error: unknown,
	logger: Logger,
): createError.HttpError => {
	if (error instanceof ZodError)
		return createError(400, error, { type: VALIDATION_ERROR_TYPE })
	if (error instanceof AppError) {
		switch (error.constructor) {
			case InvalidToken:
			case InvalidQueryFilter:
			case InvalidDeleteFilter:
			case InvalidUpdateFilter:
				return createError(400, error, { type: error.type })
			case InvalidCredentials:
			case UnauthorizedError:
				return createError(401, error, { type: error.type })
			case TokenNotFound:
			case NotFound:
				return createError(404, error, { type: error.type })
			case UserAlreadyConfirmed:
			case UsernameAlreadyExists:
			case AlreadyExists:
			case UserAlreadyExists:
			case SocialAccountAlreadyExists:
			case NoPasswordConfigured:
				return createError(409, error, { type: error.type })
			default:
				return createError(500, error, { type: error.type })
		}
	}

	logger.error(error, 'Internal Server Error')
	return createError(500, {
		...(error as Error),
		message: InternalServerError.message,
	})
}

import {
	InvalidToken,
	TokenNotFound,
} from '@api/modules/accounts/domain/token.errors'
import {
	IncorrectPassword,
	TokenAlreadyUsed,
	UserAlreadyConfirmed,
	UserAlreadyExists,
	UserNotFound,
} from '@api/modules/accounts/domain/user.errors'
import { Logger } from '@readit/logger'
import { AppError } from '@readit/utils'
import createError from 'http-errors'
import { ZodError } from 'zod'

import { InvalidQueryFilter } from './queryRepoErrors'

export const handleRESTServiceErrors = (
	error: unknown,
	logger: Logger,
): createError.HttpError => {
	if (error instanceof ZodError) createError(400, error)
	if (error instanceof AppError) {
		switch (error.constructor) {
			case InvalidToken:
			case InvalidQueryFilter:
			case IncorrectPassword:
				return createError(400, error, { type: error.type })
			case TokenNotFound:
			case UserNotFound:
				return createError(404, error, { type: error.type })
			case TokenAlreadyUsed:
			case UserAlreadyConfirmed:
			case UserAlreadyExists:
				return createError(409, error, { type: error.type })
			default:
				logger.error(error, 'Internal Server Error')
				return createError(500, error, { type: error.type })
		}
	}

	return createError(500, error as Error)
}

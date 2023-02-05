import {
	InvalidToken,
	TokenNotFound,
} from '@api/modules/accounts/domain/token.errors'
import {
	TokenAlreadyUsed,
	UserAlreadyConfirmed,
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
			case TokenNotFound:
			case UserNotFound:
				return createError(404, error)
			case InvalidToken:
			case InvalidQueryFilter:
				return createError(400, error)
			case TokenAlreadyUsed:
			case UserAlreadyConfirmed:
				return createError(409, error)
			default:
				logger.error('Internal Server Error', error)
				return createError(500, error)
		}
	}

	return createError(500, error as Error)
}

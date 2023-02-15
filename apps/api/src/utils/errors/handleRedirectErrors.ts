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
import { AppError } from '@readit/utils'
import { z, ZodError } from 'zod'

import { InvalidQueryFilter } from './queryRepoErrors'

export const getRedirectError = (error: unknown, logger: Logger): string => {
	const errorProps = handleRedirectErrors(error, logger)
	const withEmailProps: ErrorLayoutProps = {
		...errorProps,
		supportSubject: `Problem:${errorProps.title}`,
	}
	return `/error?${new URLSearchParams(withEmailProps).toString()}`
}

export const errorLayoutSchema = z.object({
	title: z.string(),
	message: z.string(),
	code: z.string(),
	supportSubject: z.string().optional(),
	supportBody: z.string().optional(),
})

export type ErrorLayoutProps = z.infer<typeof errorLayoutSchema>

const handleRedirectErrors = (
	error: unknown,
	logger: Logger,
): ErrorLayoutProps => {
	if (error instanceof ZodError) {
		return {
			code: '400',
			message: error.message,
			title: 'Validation Error',
		}
	}

	if (error instanceof AppError) {
		switch (error.constructor) {
			case InvalidToken:
				return {
					title: 'Invalid Token',
					message: 'The type of token specified is invalid',
					code: '400',
				}
			case InvalidQueryFilter:
				return {
					title: 'Invalid Query',
					message: 'The query that was executed is invalid',
					code: '400',
				}
			case IncorrectPassword:
				return {
					code: '400',
					title: 'Incorrect Password',
					message: 'The password specified is incorrect',
				}
			case TokenNotFound:
				return {
					code: '404',
					title: 'Token Not Found',
					message: "The token specified doesn't exist",
				}
			case UserNotFound:
				return {
					code: '404',
					title: 'User Not Found',
					message: "The user specified doesn't exist",
				}
			case TokenAlreadyUsed:
				return {
					code: '409',
					title: 'Token Already Used',
					message: 'The token specified has already been used',
				}
			case UserAlreadyConfirmed:
				return {
					code: '409',
					title: 'User Already Confirmed',
					message: 'The user specified has already been confirmed',
				}
			case UserAlreadyExists:
				return {
					code: '409',
					title: 'User Already Exists',
					message: 'The user specified already exists',
				}
			case TokenAlreadyExpired:
				return {
					code: '409',
					title: 'Token Already Expired',
					message: 'The token specified is already expired',
				}
			default:
				logger.error(error, 'Internal Server Error')
				return {
					code: '500',
					title: 'Something went wrong',
					message: 'Oopps, something went wrong. Please try again later.',
				}
		}
	}

	return {
		code: '500',
		title: 'Something went wrong',
		message: 'Oopps, something went wrong. Please try again later.',
	}
}

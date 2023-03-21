import {
	FailedToGetOAuthToken,
	FailedToGetOAuthUser,
	OAuthAccountNotVerified,
	SocialAccountAlreadyExists,
	SocialAlreadyConnectedToAnotherAccount,
	StateParameterMismatch,
} from '@api/modules/accounts/domain/oAuth.errors'
import {
	InvalidToken,
	TokenNotFound,
} from '@api/modules/accounts/domain/token.errors'
import {
	UserAlreadyConfirmed,
	UserAlreadyExists,
	UsernameAlreadyExists,
	InvalidCredentials,
	UserNotFound,
	NoPasswordConfigured,
	EmailAlreadyTaken,
} from '@api/modules/accounts/domain/user.errors'
import { Logger } from '@readit/logger'
import { z, ZodError } from 'zod'

import {
	AppError,
	InternalServerError,
	UnauthorizedError,
	NotFound,
	AlreadyExists,
} from './baseError'
import {
	InvalidQueryFilter,
	InvalidUpdateFilter,
	InvalidDeleteFilter,
} from './repoErrors'

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
	errorJson: z.string().optional(),
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
			message: error.errors.map((e) => e.message).join(', '),
			title: 'Validation Error',
			errorJson: error.toString(),
		}
	}

	if (error instanceof AppError) {
		const message = error.message
		const defaultTitle = 'Something went wrong'
		switch (error.constructor) {
			// 400 errors
			case InvalidToken:
			case InvalidQueryFilter:
			case InvalidDeleteFilter:
			case InvalidUpdateFilter:
			case StateParameterMismatch:
				return {
					title: error.type,
					code: '400',
					message,
				}

			// 401 errors
			case UnauthorizedError:
			case InvalidCredentials:
				return {
					code: '401',
					title: error.type,
					message,
				}

			// 403 errors
			case FailedToGetOAuthUser: {
				const title =
					error instanceof FailedToGetOAuthUser
						? `${error.provider} Login Error`
						: 'Social Login Error'
				return {
					code: '403',
					title: title,
					message,
				}
			}
			case FailedToGetOAuthToken: {
				const title =
					error instanceof FailedToGetOAuthToken
						? `${error.provider} Login Error`
						: 'Social Login Error'
				return {
					code: '403',
					title: title,
					message: 'Failed to get OAuth token from code',
				}
			}
			case OAuthAccountNotVerified: {
				const code = '403'
				return error instanceof OAuthAccountNotVerified
					? {
							title: `${error.provider} Login Error`,
							message: error.message,
							code,
					  }
					: {
							title: 'Social Login Error',
							message: error.message,
							code,
					  }
			}

			// 404 errors
			case TokenNotFound:
			case UserNotFound:
			case NotFound:
				return {
					code: '404',
					title: defaultTitle,
					message,
				}

			// 409 errors
			case UserAlreadyConfirmed:
			case SocialAlreadyConnectedToAnotherAccount:
			case UsernameAlreadyExists:
			case EmailAlreadyTaken:
			case UserAlreadyExists:
			case SocialAccountAlreadyExists:
			case NoPasswordConfigured:
			case AlreadyExists:
				return {
					code: '409',
					title: error.type,
					message,
				}
			default:
				logger.error(error, 'Internal Server Error')
				return {
					code: '500',
					title: defaultTitle,
					message,
				}
		}
	}

	logger.error(error, 'Internal Server Error')
	return {
		code: '500',
		title: 'Internal Server Error',
		message: InternalServerError.message,
	}
}

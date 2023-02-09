import { InvalidQueryFilter } from '@api/utils/errors/queryRepoErrors'
import { AppError, DBError, ErrorOpts } from '@readit/utils'

import { InvalidToken, TokenNotFound } from './token.errors'

export type FindByIdError = UserNotFound | DBError | InvalidQueryFilter
export type RegistrationError = UserAlreadyExists | DBError
export type ConfirmUserError =
	| TokenNotFound
	| DBError
	| InvalidToken
	| UserAlreadyConfirmed
	| TokenAlreadyUsed
	| UserNotFound
	| InvalidQueryFilter
export type LoginError =
	| IncorrectPassword
	| UserNotFound
	| DBError
	| InvalidQueryFilter
export type VerifyTokenError =
	| TokenNotFound
	| DBError
	| InvalidToken
	| TokenAlreadyExpired

export class UserNotFound extends AppError {
	static type = 'USER_NOT_FOUND'

	constructor({ message = 'User was not found', ...opts }: ErrorOpts) {
		super({ ...opts, type: UserNotFound.type, message })
		this.name = UserNotFound.type
	}
}

export class UserAlreadyExists extends AppError {
	static type = 'USER_ALREADY_EXISTS'

	constructor({ message = 'User already exists', ...opts }: ErrorOpts) {
		super({ ...opts, type: UserAlreadyExists.type, message })
		this.name = UserAlreadyExists.type
	}
}

export class UserAlreadyConfirmed extends AppError {
	static type = 'USER_ALREADY_CONFIRMED'

	constructor({ message = 'User already confirmed', ...opts }: ErrorOpts) {
		super({ ...opts, type: UserAlreadyConfirmed.type, message })
		this.name = UserAlreadyConfirmed.type
	}
}

export class TokenAlreadyUsed extends AppError {
	static type = 'TOKEN_ALREADY_USED'

	constructor({ message = 'Token already used', ...opts }: ErrorOpts) {
		super({ ...opts, type: TokenAlreadyUsed.type, message })
		this.name = TokenAlreadyUsed.type
	}
}

export class IncorrectPassword extends AppError {
	static type = 'INCORRECT_PASSWORD'

	constructor({ message = 'Incorrect password', ...opts }: ErrorOpts) {
		super({ ...opts, type: IncorrectPassword.type, message })
		this.name = IncorrectPassword.type
	}
}

export class TokenAlreadyExpired extends AppError {
	static type = 'TOKEN_ALREADY_EXPIRED'

	constructor({ message = 'Token already expired', ...opts }: ErrorOpts) {
		super({ ...opts, type: TokenAlreadyExpired.type, message })
		this.name = TokenAlreadyExpired.type
	}
}

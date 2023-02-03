import { AppError, DBError, ErrorOpts } from '@readit/utils'

import { InvalidToken, TokenNotFound } from './token.errors'

export type FindByIdError = UserNotFound | DBError
export type RegistrationError =
	| UserAlreadyExists
	| DBError
	| PasswordHashingError
export type ConfirmUserError =
	| TokenNotFound
	| DBError
	| InvalidToken
	| FindByIdError
	| UserAlreadyConfirmed
	| TokenAlreadyUsed

export class UserNotFound extends AppError {
	static type = 'USER_NOT_FOUND'

	constructor({ message = 'User was not found', ...opts }: ErrorOpts) {
		super({ ...opts, type: UserNotFound.type, message })
		this.name = UserNotFound.type
	}
}

export class PasswordHashingError extends AppError {
	static type = 'PASSWORD_HASHING_ERROR'

	constructor({ message = 'Something went wrong', ...opts }: ErrorOpts) {
		super({ ...opts, type: PasswordHashingError.type, message })
		this.name = PasswordHashingError.type
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

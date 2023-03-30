import {
	AppError,
	ErrorOpts,
	InternalServerError,
	NotFound,
} from '@api/utils/errors/baseError'
import { DBError, InvalidQueryFilter } from '@api/utils/errors/repoErrors'

import { SocialAccountAlreadyExists } from './oAuth.errors'
import { InvalidToken, TokenNotFound } from './token.errors'

export type FindByIdError =
	| NotFound
	| DBError
	| InvalidQueryFilter
	| InternalServerError
export type RegistrationError =
	| UserAlreadyExists
	| UsernameAlreadyExists
	| DBError
	| InternalServerError
	| InvalidQueryFilter
export type ConfirmUserError =
	| TokenNotFound
	| DBError
	| InvalidToken
	| UserAlreadyConfirmed
	| NotFound
	| InvalidQueryFilter
	| InternalServerError
export type LoginError =
	| InvalidCredentials
	| NoPasswordConfigured
	| DBError
	| InvalidQueryFilter
	| InternalServerError
export type VerifyTokenError =
	| TokenNotFound
	| DBError
	| InvalidToken
	| InvalidQueryFilter
	| InternalServerError
export type FindByEmailError = InvalidQueryFilter | DBError
export type CreateUserFromSocial =
	| InvalidQueryFilter
	| DBError
	| UserAlreadyExists
	| UsernameAlreadyExists
	| SocialAccountAlreadyExists
	| InternalServerError

export class UserAlreadyExists extends AppError {
	static type = 'User Already Exists'

	constructor({ message = 'User already exists', ...opts }: ErrorOpts) {
		super({ ...opts, type: UserAlreadyExists.type, message })
		this.name = UserAlreadyExists.type
	}
}

export class UsernameAlreadyExists extends AppError {
	static type = 'Username Already Exists'

	constructor({ message = 'Username already exists', ...opts }: ErrorOpts) {
		super({ ...opts, type: UsernameAlreadyExists.type, message })
		this.name = UsernameAlreadyExists.type
	}
}

export class UserAlreadyConfirmed extends AppError {
	static type = 'User Already Confirmed'

	constructor({ message = 'User already confirmed', ...opts }: ErrorOpts) {
		super({ ...opts, type: UserAlreadyConfirmed.type, message })
		this.name = UserAlreadyConfirmed.type
	}
}

export class InvalidPassword extends AppError {
	static type = 'Invalid Password'

	constructor({ message = 'Invalid password', ...opts }: ErrorOpts) {
		super({ ...opts, type: InvalidPassword.type, message })
		this.name = InvalidPassword.type
	}
}

export class NoPasswordConfigured extends AppError {
	static type = 'No Password Configured'

	constructor({
		message = 'Existing account does not have a configured password yet. Please use social login or update your password to login using credentials',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: NoPasswordConfigured.type, message })
		this.name = NoPasswordConfigured.type
	}
}

export class InvalidCredentials extends AppError {
	static type = 'Invalid Credentials'

	constructor({
		message = 'Username, Email or Password is Incorrect',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: InvalidCredentials.type, message })
		this.name = InvalidCredentials.type
	}
}

export class EmailAlreadyTaken extends AppError {
	static type = 'Email Already Taken'

	constructor({ message = 'Email already taken', ...opts }: ErrorOpts) {
		super({ ...opts, type: EmailAlreadyTaken.type, message })
		this.name = EmailAlreadyTaken.type
	}
}

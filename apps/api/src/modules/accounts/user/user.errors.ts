import { AppError, DBError, ErrorOpts } from '@readit/utils'

export * as UserErrors from './user.errors'

export type FindByIdError = UserNotFound | DBError
export type RegistrationError =
	| UserAlreadyExists
	| DBError
	| PasswordHashingError

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

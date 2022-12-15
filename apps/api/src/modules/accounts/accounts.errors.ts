import { ApplicationError, DatabaseError } from '@api/helpers/errors'

export type RegistrationError = UserAlreadyExists | DatabaseError

export type FindUserByIdError = UserNotFound | DatabaseError

export class UserAlreadyExists extends ApplicationError {
	constructor(error: unknown, message = 'User already exists') {
		super({
			message,
			code: 'CONFLICT',
			cause: error,
			type: 'USER_ALREADY_EXISTS',
		})
	}
}

export class UserNotFound extends ApplicationError {
	constructor(error: unknown, message = 'User not found') {
		super({
			message,
			code: 'NOT_FOUND',
			cause: error,
			type: 'USER_NOT_FOUND',
		})
	}
}

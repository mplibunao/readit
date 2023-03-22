import { AppError, ErrorOpts } from '@api/utils/errors/baseError'

export class TokenNotFound extends AppError {
	static type = 'Email Link has expired'

	constructor({ message = 'Please request a new one', ...opts }: ErrorOpts) {
		super({ ...opts, type: TokenNotFound.type, message })
		this.name = TokenNotFound.type
	}
}

export class InvalidToken extends AppError {
	static type = 'Invalid Token'

	constructor({ message = 'Token is invalid', ...opts }: ErrorOpts) {
		super({ ...opts, type: InvalidToken.type, message })
		this.name = InvalidToken.type
	}
}

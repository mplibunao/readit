import { AppError, ErrorOpts } from '@readit/utils'

export class TokenNotFound extends AppError {
	static type = 'TOKEN_NOT_FOUND'

	constructor({ message = 'Token was not found', ...opts }: ErrorOpts) {
		super({ ...opts, type: TokenNotFound.type, message })
		this.name = TokenNotFound.type
	}
}

export class InvalidToken extends AppError {
	static type = 'INVALID_TOKEN'

	constructor({ message = 'Token is invalid', ...opts }: ErrorOpts) {
		super({ ...opts, type: InvalidToken.type, message })
		this.name = InvalidToken.type
	}
}

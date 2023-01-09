import { getErrorFromUnknown, getMessageFromUnknownError } from './utils'

export * as BaseError from './index'

export interface ErrorOpts {
	cause?: unknown
	message?: string
	type?: string
}

export class AppError extends Error {
	static type = 'APP_ERROR'
	public readonly type: string
	public readonly cause?: unknown

	constructor(opts: ErrorOpts) {
		const message =
			opts.message ?? getMessageFromUnknownError(opts.cause, opts.type)
		const type = opts.type ?? AppError.type
		const cause: Error | undefined =
			opts.cause !== undefined ? getErrorFromUnknown(opts.cause) : undefined

		super(message)

		this.cause = cause
		this.type = type
		this.name = 'AppError'

		Object.setPrototypeOf(this, new.target.prototype)
	}
}

/*
 *Error message will fallback to cause or type (in that order)
 */
export class DBError extends AppError {
	static type = 'DB_ERROR'

	constructor(opts: ErrorOpts) {
		super({ ...opts, type: DBError.type })
		this.name = DBError.type
	}
}

export class DomainValidationError extends AppError {
	static type = 'VALIDATION_ERROR'

	constructor(opts: ErrorOpts) {
		super({ ...opts, type: DomainValidationError.type })
		this.name = DomainValidationError.type
	}
}

export class DomainOutputValidationError extends AppError {
	static type = 'INVALID_DOMAIN_ERROR'

	constructor(opts: ErrorOpts) {
		super({ ...opts, type: DomainOutputValidationError.type })
		this.name = DomainOutputValidationError.type
	}
}

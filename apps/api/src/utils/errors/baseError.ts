import { getErrorFromUnknown, getMessageFromUnknownError } from './utils'

export interface ErrorOpts {
	cause?: unknown
	message?: string
	type?: string
}

export class AppError extends Error {
	static type = 'Application Error'
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

export class InternalServerError extends AppError {
	static type = 'Internal Server Error'
	static message =
		'Oh no! Something went wrong. Please come back later or contact customer support'

	constructor({
		message = 'Oh no! Something went wrong. Please come back later or contact customer support',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: InternalServerError.type, message })
		this.name = InternalServerError.type
	}
}

export class UnauthorizedError extends AppError {
	static type = 'Unauthorized'

	constructor({
		message = 'You are not authorized to perform this action',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: UnauthorizedError.type, message })
		this.name = UnauthorizedError.type
	}
}

export class NotFound extends AppError {
	static type = 'Resource Not Found'

	constructor({ message = 'Not Found', ...opts }: ErrorOpts) {
		super({ ...opts, type: NotFound.type, message })
		this.name = NotFound.type
	}
}

export class AlreadyExists extends AppError {
	static type = 'Resource Already Exists'

	constructor({ message = 'Already Exists', ...opts }: ErrorOpts) {
		super({ ...opts, type: AlreadyExists.type, message })
		this.name = AlreadyExists.type
	}
}

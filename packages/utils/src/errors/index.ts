import { getErrorFromUnknown, getMessageFromUnknownError } from './utils'

interface ErrorOpts {
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

import { TRPCError } from '@trpc/server'
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/dist/rpc'

export class ApplicationError extends TRPCError {
	public readonly type
	constructor(opts: {
		cause?: unknown
		code: TRPC_ERROR_CODE_KEY
		message?: string
		type: string
		//type: 'DATABASE_ERROR' | 'APP_ERROR'
	}) {
		super({
			cause: opts.cause !== undefined ? opts.cause : undefined,
			code: opts.code,
			message: opts.message,
		})

		this.type = opts.type
	}
}

export class DatabaseError extends ApplicationError {
	static type = 'DATABASE_ERROR'

	constructor(cause: unknown) {
		super({
			cause,
			message: 'A database error occurred',
			code: 'INTERNAL_SERVER_ERROR',
			type: DatabaseError.type,
		})
	}
}

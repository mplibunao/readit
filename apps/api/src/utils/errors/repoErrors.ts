import { AppError, ErrorOpts, InternalServerError } from './baseError'

/*
 *Error message will fallback to cause or type (in that order)
 */
export class DBError extends InternalServerError {
	static type = 'Database Error'

	constructor(opts: ErrorOpts) {
		super({ ...opts, type: DBError.type })
		this.name = DBError.type
	}
}

export class InvalidQueryFilter extends AppError {
	static type = 'Invalid Query Filter'

	constructor({
		message = 'You must set at least one valid where condition to your query',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: InvalidQueryFilter.type, message })
		this.name = InvalidQueryFilter.type
	}
}

export class InvalidUpdateFilter extends AppError {
	static type = 'Invalid Update Filter'

	constructor({
		message = 'You must set at least one valid where condition to your update query',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: InvalidUpdateFilter.type, message })
		this.name = InvalidUpdateFilter.type
	}
}

export class InvalidDeleteFilter extends AppError {
	static type = 'Invalid Delete Filter'

	constructor({
		message = 'You must set at least one valid where condition to your delete query',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: InvalidDeleteFilter.type, message })
		this.name = InvalidDeleteFilter.type
	}
}

import { AppError, ErrorOpts } from '@readit/utils'

export class InvalidQueryFilter extends AppError {
	static type = 'INVALID_QUERY_FILTER'

	constructor({
		message = 'You must set at least one where condition to your query',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: InvalidQueryFilter.type, message })
		this.name = InvalidQueryFilter.type
	}
}

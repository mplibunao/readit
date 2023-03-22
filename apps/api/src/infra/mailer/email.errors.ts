import { AppError, ErrorOpts } from '@api/utils/errors/baseError'
import { DBError } from '@api/utils/errors/repoErrors'

export type SendConfirmEmailError = PostmarkError | DBError

export class PostmarkError extends AppError {
	static type = 'Postmark Error'

	constructor({
		message = 'Sending email through postmark failed',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: PostmarkError.type, message })
		this.name = PostmarkError.type
	}
}

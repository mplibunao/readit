import { AppError, DBError, ErrorOpts } from '@readit/utils'

export type SendConfirmEmailError = PostmarkError | DBError

export class PostmarkError extends AppError {
	static type = 'POSTMARK_ERROR'

	constructor({
		message = 'Sending email through postmark failed',
		...opts
	}: ErrorOpts) {
		super({ ...opts, type: PostmarkError.type, message })
		this.name = PostmarkError.type
	}
}

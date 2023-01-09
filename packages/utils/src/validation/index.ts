import { err } from 'neverthrow'
import { ErrorOpts } from 'src/errors'
import { SafeParseReturnType } from 'zod'

Error
export const safeValidateSchema = <Value, Err extends ErrorConstructor>(
	validatedValue: SafeParseReturnType<unknown, Value>,
	error: Err,
	errorMessage?: string,
) => {
	if (!validatedValue.success) {
		const errorObj: ErrorOpts = { cause: validatedValue.error.cause }
		if (errorMessage) errorObj.message = errorMessage
		return err(error(errorObj))
	}
}

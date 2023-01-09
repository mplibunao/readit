export function getMessageFromUnknownError(
	err: unknown,
	fallback?: string,
): string {
	if (typeof err === 'string') {
		return err
	}

	if (err instanceof Error && typeof err.message === 'string') {
		return err.message
	}

	if (fallback) {
		return fallback
	}

	return 'Unknown error'
}

export function getErrorFromUnknown(cause: unknown): Error {
	if (cause instanceof Error) {
		return cause
	}
	const message = getMessageFromUnknownError(cause, 'Unknown error')
	return new Error(message)
}

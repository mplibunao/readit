export const responseStatusOk = {
	type: 'object',
	properties: {
		status: { type: 'string' },
	},
}

export const errorSchema = {
	$id: 'errorSchema',
	type: 'object',
	properties: {
		statusCode: { type: 'number' },
		error: { type: 'string' },
		message: { type: 'string' },
	},
	required: ['statusCode', 'error', 'message'],
} as const

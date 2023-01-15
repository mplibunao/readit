import pino from 'pino'

function getConfig() {
	const IS_PROD = process.env.IS_PROD || false
	const LOGGING_LEVEL = process.env.LOGGING_LEVEL || 'info'

	if (IS_PROD) {
		return {
			level: LOGGING_LEVEL,
		}
	}

	return {
		level: LOGGING_LEVEL,
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
	}
}
export const logger = pino(getConfig())

export type Logger = typeof logger

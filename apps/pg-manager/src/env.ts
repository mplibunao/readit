import { LoggerOpts } from '@readit/pino-logger'
import dotenv from 'dotenv'
import { PoolConfig } from 'pg'
import { parseEnv } from 'znv'
import { z } from 'zod'

const loadEnv = () => {
	const NODE_ENV = process.env.NODE_ENV || 'development'
	const CI = Boolean(process.env.CI)

	if (CI || NODE_ENV === 'production') return
	if (NODE_ENV === 'test') dotenv.config({ path: '.env.test' })
	if (NODE_ENV === 'development') dotenv.config()
}

loadEnv()

const serverSchema = {
	DATABASE_URL: z.string().url(),
	APP_NAME: z.string().default('pg-manager'),
	APP_VERSION: z.string().default('0.0.0'),
	K_SERVICE: z.string().optional(),
	LOGGING_LEVEL: z
		.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
		.default('warn'),
	IS_PROD: z.boolean(),
}

const { APP_NAME, DATABASE_URL, K_SERVICE, ...logger } = parseEnv(
	process.env,
	serverSchema,
)

export const loggerConfig: LoggerOpts = {
	APP_NAME,
	IS_GCP_CLOUD_RUN: !!K_SERVICE,
	...logger,
}

export const pgConfig: PoolConfig = {
	connectionString: DATABASE_URL,
	application_name: APP_NAME,
}

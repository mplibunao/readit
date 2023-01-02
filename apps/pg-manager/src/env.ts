import { LoggerOpts } from '@readit/pino-logger'
import dotenv from 'dotenv'
import { PoolConfig } from 'pg'
import { z, ZodFormattedError } from 'zod'

const NODE_ENV = process.env.NODE_ENV || 'development'

if (!['development', 'test', 'production'].includes(NODE_ENV)) {
	throw new Error('NODE_ENV must be one of development, test, or production')
}

if (NODE_ENV === 'development') dotenv.config()
if (NODE_ENV === 'test') dotenv.config({ path: '.env.test' })

const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) =>
	Object.entries(errors)
		.map(([name, value]) => {
			if (value && '_errors' in value)
				return `${name}: ${value._errors.join(', ')}\n`

			return null
		})
		.filter(Boolean)

const serverSchema = z.object({
	DATABASE_URL: z.string().url(),
	APP_NAME: z.string().default('pg-manager'),
	APP_VERSION: z.string().default('0.0.0'),
	K_SERVICE: z.string().optional(),
	LOGGING_LEVEL: z
		.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
		.optional()
		.default('info'),
	IS_PROD: z.preprocess((val) => Boolean(val), z.boolean()),
})

const result = serverSchema.safeParse(process.env)

if (!result.success) {
	console.error(
		'❌ Invalid environment variables:\n',
		...formatErrors(result.error.format()),
	)
	throw new Error('Invalid environment variables')
}

const { APP_NAME, DATABASE_URL, K_SERVICE, ...logger } = result.data

export const loggerConfig: LoggerOpts = {
	APP_NAME,
	IS_GCP_CLOUD_RUN: !!K_SERVICE,
	...logger,
}

export const pgConfig: PoolConfig = {
	connectionString: DATABASE_URL,
	application_name: APP_NAME,
}

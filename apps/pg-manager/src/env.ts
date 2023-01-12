import dotenv from 'dotenv'
import { z, ZodFormattedError } from 'zod'

import { LoggerOpts, loggerOptsEnvSchema } from './logger/createLogger'
import { BooleanSchema, NumberSchema } from './schemas'

const loadEnv = () => {
	const NODE_ENV = process.env.NODE_ENV || 'development'
	const CI = Boolean(process.env.CI)

	if (CI || NODE_ENV === 'production') return
	if (NODE_ENV === 'test') dotenv.config({ path: '.env.test' })
	if (NODE_ENV === 'development') dotenv.config()
}

loadEnv()

/*
 *Kysely
 */
export const kyselyPGEnvSchema = {
	DATABASE_URL: z.string().url(),
	APP_NAME: z.string(),
	PG_IDLE_TIMEOUT_MS: NumberSchema.optional().default(60_000),
	PG_SSL: BooleanSchema.optional().default(true),
	IS_PROD: BooleanSchema,
}
const kyselyPGSchema = z.object(kyselyPGEnvSchema)
export type KyselyPGConfigOpts = z.infer<typeof kyselyPGSchema>

const PgManagerEnv = z
	.object({
		...loggerOptsEnvSchema,
		...kyselyPGEnvSchema,
	})
	.safeParse(process.env)

if (!PgManagerEnv.success) {
	console.error(
		'❌ Invalid environment variables:\n',
		...formatErrors(PgManagerEnv.error.format()),
	)
	throw new Error('Invalid env variables')
}
console.log('PgManagerEnv', PgManagerEnv) // eslint-disable-line no-console

export const loggerConfig: LoggerOpts = PgManagerEnv.data

export const pgConfig: KyselyPGConfigOpts = PgManagerEnv.data

function formatErrors(errors: ZodFormattedError<Map<string, string>, string>) {
	return Object.entries(errors)
		.map(([name, value]) => {
			if (value && '_errors' in value)
				return `${name}: ${value._errors.join(', ')}\n`

			return null
		})
		.filter(Boolean)
}

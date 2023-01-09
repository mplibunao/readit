import { loadEnv } from '@readit/env'
import { LoggerOpts, loggerOptsEnvSchema } from '@readit/logger'
import { parseEnv } from 'znv'
import { z } from 'zod'

loadEnv()

export const kyselyPGEnvSchema = {
	DATABASE_URL: z.string().url(),
	APP_NAME: z.string(),
	PG_IDLE_TIMEOUT_MS: z.number().optional().default(60_000),
	PG_SSL: z.boolean().optional().default(true),
	IS_PROD: z.boolean(),
}
const kyselyPGSchema = z.object(kyselyPGEnvSchema)
export type KyselyPGConfigOpts = z.infer<typeof kyselyPGSchema>

const PgManagerEnvSchema = {
	...loggerOptsEnvSchema,
	...kyselyPGEnvSchema,
}

const env = parseEnv(process.env, PgManagerEnvSchema)

export const loggerConfig: LoggerOpts = env

export const pgConfig: KyselyPGConfigOpts = env

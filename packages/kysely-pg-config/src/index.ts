import { Logger } from '@readit/logger'
import { CamelCasePlugin, KyselyConfig, PostgresDialect } from 'kysely'
import pg from 'pg'
import { z } from 'zod'

export const kyselyPGEnvSchema = {
	DATABASE_URL: z.string().url(),
	APP_NAME: z.string(),
	PG_IDLE_TIMEOUT_MS: z.number().optional().default(60_000),
	PG_SSL: z.boolean().optional().default(false),
	IS_PROD: z.boolean(),
}

const kyselyPGSchema = z.object(kyselyPGEnvSchema)

export type KyselyPGConfigOpts = z.infer<typeof kyselyPGSchema> & {
	logger: Logger
}

export const getKyselyPgConfig = (opts: KyselyPGConfigOpts): KyselyConfig => {
	const { logger } = opts
	return {
		dialect: new PostgresDialect({
			pool: new pg.Pool({
				connectionString: opts.DATABASE_URL,
				application_name: opts.APP_NAME,
				idleTimeoutMillis: opts.PG_IDLE_TIMEOUT_MS,
				ssl: opts.PG_SSL,
			}),
		}),
		plugins: [
			new CamelCasePlugin({
				underscoreBeforeDigits: true,
				underscoreBetweenUppercaseLetters: true,
				upperCase: false,
			}),
		],
		log(event) {
			if (opts.IS_PROD) {
				if (event.level === 'error') {
					logger.error(`pg error: ${event.error}`)
				}
			} else {
				if (event.level === 'query') {
					logger.info(`pg query sql: ${event.query.sql}`)
					logger.info(`pg query params: ${event.query.parameters}`)
				}
				if (event.level === 'error') {
					logger.error(`pg error: ${event.error}`)
				}
			}
		},
	}
}

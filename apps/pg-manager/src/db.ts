import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

import { DB } from './db.d'
import { pgConfig } from './env'
import { logger } from './logger'

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new pg.Pool({
			connectionString: pgConfig.DATABASE_URL,
			application_name: pgConfig.APP_NAME,
			idleTimeoutMillis: pgConfig.PG_IDLE_TIMEOUT_MS,
			ssl: pgConfig.PG_SSL,
		}),
	}),
	plugins: [
		new CamelCasePlugin({
			underscoreBeforeDigits: true,
			underscoreBetweenUppercaseLetters: true,
			upperCase: false,
		}),
	],
	log(event): void {
		if (pgConfig.IS_PROD) {
			if (event.level === 'error') {
				logger.error(`PG error: ${event.error}`)
			}
		} else {
			if (event.level === 'query') {
				logger.info(`PG query sql: ${event.query.sql}`)
				logger.info(`pg query params: ${event.query.parameters}`)
			}
			if (event.level === 'error') {
				logger.error(`pg error: ${event.error}`)
			}
		}
	},
})

export type IDB = typeof db

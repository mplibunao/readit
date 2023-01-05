import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

import { DB } from './db.d'
import { loggerConfig, pgConfig } from './env'
import { logger } from './logger'

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new pg.Pool(pgConfig),
	}),
	plugins: [
		new CamelCasePlugin({
			underscoreBeforeDigits: true,
			underscoreBetweenUppercaseLetters: true,
			upperCase: false,
		}),
	],
	log(event): void {
		if (loggerConfig.IS_PROD) {
			if (event.level === 'error') {
				logger?.error(`pg error: ${event.error}`)
			}
		} else {
			if (event.level === 'query') {
				logger?.info(`pg query sql: ${event.query.sql}`)
				logger?.info(`pg query params: ${event.query.parameters}`)
			}
			if (event.level === 'error') {
				logger?.error(`pg error: ${event.error}`)
			}
		}
	},
})

export type IDB = typeof db

import { getLogger } from '@readit/pino-logger'
import { promises as fs } from 'fs'
import {
	CamelCasePlugin,
	FileMigrationProvider,
	Kysely,
	Migrator,
	PostgresDialect,
} from 'kysely'
import { run } from 'kysely-migration-cli'
import * as path from 'path'
import pg from 'pg'

import { loggerConfig, pgConfig } from './env'

/*
 *https://github.com/acro5piano/kysely-migration-cli
 *CLI-based migration
 */

const main = async () => {
	const logger = getLogger(loggerConfig)

	const db = new Kysely<any>({
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

	const migrationPath = path.join(__dirname, 'migrations')
	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: migrationPath,
		}),
	})
	run(db, migrator, migrationPath)
}

main()

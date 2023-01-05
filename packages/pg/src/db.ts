import { DB } from '@readit/pg-manager'
import { CamelCasePlugin, Kysely, LogConfig, PostgresDialect } from 'kysely'
import pg, { PoolConfig } from 'pg'

export type PG = Kysely<DB>
export type PgOpts = PoolConfig

export const createPgClient = (opts: PgOpts, logCallback: LogConfig) => {
	return new Kysely<DB>({
		dialect: new PostgresDialect({
			pool: new pg.Pool(opts),
		}),
		plugins: [
			new CamelCasePlugin({
				underscoreBeforeDigits: true,
				underscoreBetweenUppercaseLetters: true,
				upperCase: false,
			}),
		],
		log: logCallback,
	})
}

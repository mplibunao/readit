import { FastifyBaseLogger } from 'fastify'
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely'
import pg, { PoolConfig } from 'pg'
import { DB } from './pg.generated'

export type PG = Kysely<DB>

export interface PgOpts extends PoolConfig {
	isProd: boolean
}

export const createPgClient = (opts: PgOpts, logger: FastifyBaseLogger) => {
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
		log(event): void {
			if (opts.isProd) {
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
	})
}
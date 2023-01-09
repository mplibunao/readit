import { getKyselyPgConfig, KyselyPGConfigOpts } from '@readit/kysely-pg-config'
import { DB } from '@readit/pg-manager'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { Kysely } from 'kysely'

export type PG = Kysely<DB>

declare module 'fastify' {
	interface FastifyInstance {
		pg: PG
	}
}

export type PgPluginOpts = Omit<KyselyPGConfigOpts, 'logger'>

export const kyselyPg: FastifyPluginAsync<PgPluginOpts> = async (
	fastify,
	opts,
) => {
	const name = 'pg'

	try {
		const db = new Kysely<DB>(
			getKyselyPgConfig({
				...opts,
				logger: fastify.log,
			}),
		)

		if (fastify[name]) {
			throw new Error(`plugin '${name}' instance has already been registered`)
		}

		fastify.decorate(name, db).addHook('onClose', (fastify, done) => {
			fastify.pg.destroy()
			done()
		})
	} catch (err) {
		const error = `Error initializing kysely with postgres dialect: ${err}`
		fastify.log.error(error)
		throw new Error(error)
	}
}

export default fp(kyselyPg, {
	name: 'pg',
})

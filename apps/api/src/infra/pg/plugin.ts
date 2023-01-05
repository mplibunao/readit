import { createPgClient, PG, PgOpts } from '@readit/pg'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import { pgLogCallback } from './pgLogCallback'

declare module 'fastify' {
	interface FastifyInstance {
		pg: PG
	}
}

export const kyselyPg: FastifyPluginAsync<PgOpts> = async (fastify, opts) => {
	const name = 'pg'

	try {
		const db = createPgClient(opts, pgLogCallback)

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

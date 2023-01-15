import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

import type { PG } from './client'

declare module 'fastify' {
	interface FastifyInstance {
		pg: PG
	}
}

/*
 * This plugin is not initialized like normal fastify plugins and instead takes the actual pg client as the opts and decorates it to the fastify instance
 * The reasons are
 *
 * 1. We don't want to pass the pg client as part of context to give us the option to create multiple trpc microservices and merge them as single one to be consumed by the frontend
 *	See https://github.com/trpc/trpc/tree/main/examples/soa
 *	The example above requires that each microservice has the same context (therefore dependencies) which defeat the purpose of the isolation
 *	Therefore we remove dependencies from the context and instead import them directly
 *
 * 2. There's a bug in the healthcheck plugin where it doesn't return the full payload if you import an external deps
 */

export const kyselyPg: FastifyPluginAsync<PG> = async (fastify, pgInstance) => {
	const name = 'pg'

	try {
		if (fastify[name]) {
			throw new Error(`plugin '${name}' instance has already been registered`)
		}

		fastify.decorate(name, pgInstance).addHook('onClose', (fastify, done) => {
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

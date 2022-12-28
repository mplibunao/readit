import App from '@api/app'
import { Config, config } from '@api/config'
import Fastify from 'fastify'
import fp from 'fastify-plugin'
import { afterAll, beforeAll } from 'vitest'

//const clearDatabase = async (fastify: FastifyInstance) => {
//await fastify.pg.sql`DELETE FROM users`
//}

// Automatically build and tear down our instance
async function build(opts?: { config?: Partial<Config> }) {
	const fastify = Fastify()

	/*
	 *fastify-plugin ensures that all decorators
	 *are exposed for testing purposes, this is
	 *different from the production setup
	 */
	await fastify.register(fp(App), {
		...config,
		...opts?.config,
	})

	beforeAll(async () => {
		await fastify.ready()
		//await clearDatabase(fastify)
	})

	//beforeEach(async () => {
	//await clearDatabase(fastify)
	//})

	//afterEach(async () => {
	//await clearDatabase(fastify)
	//})

	// Tear down our app after we are done
	afterAll(() => {
		fastify.close()
	})

	return fastify
}

export { build }

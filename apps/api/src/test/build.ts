import App from '@api/app'
import { Config, config } from '@api/infra/config'
import { DependencyOverrides } from '@api/infra/diConfig'
import Fastify from 'fastify'
import fp from 'fastify-plugin'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'

import { clearDatabase } from './clearDatabase'

// Automatically build and tear down our instance
async function build(opts?: {
	config?: Partial<Config>
	dependencyOverrides?: DependencyOverrides
}) {
	const fastify = Fastify()

	/*
	 *fastify-plugin ensures that all decorators
	 *are exposed for testing purposes, this is
	 *different from the production setup
	 */
	await fastify.register(fp(App), {
		config: { ...config, ...opts?.config },
		dependencyOverrides: opts?.dependencyOverrides ?? {},
	})

	beforeAll(async () => {
		await fastify.ready()
		await clearDatabase(fastify.diContainer.cradle.pg)
	})

	beforeEach(async () => {
		await clearDatabase(fastify.diContainer.cradle.pg)
	})

	afterEach(async () => {
		await clearDatabase(fastify.diContainer.cradle.pg)
		fastify.routes.clear()
	})

	// Tear down our app after we are done
	afterAll(async () => {
		await fastify.close()
		fastify.routes.clear()
	})

	return fastify
}

export { build }

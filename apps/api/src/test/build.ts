import App from '@api/app'
import { Config, config } from '@api/infra/config'
import { DependencyOverrides, SINGLETON_CONFIG } from '@api/infra/diConfig'
import { asFunction, asValue } from 'awilix'
import Fastify from 'fastify'
import fp from 'fastify-plugin'
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest'

import { clearDatabase } from './clearDatabase'
import { buildMockEdgeConfig } from './mocks/edgeConfig'
import { silentLogger } from './mocks/logger'
import { createMockPubSubClient } from './mocks/pubsub'

// Automatically build and tear down our instance
async function build(opts?: {
	config?: Partial<Config>
	dependencyOverrides?: DependencyOverrides
}) {
	const fastify = Fastify()

	/*
	 * Sets mock dependencies by default for tests but feel free to override especially if you need to use mockResolveValue or assert if function was called
	 * See accounts/routers/user.router.test.ts for example
	 */
	const defaultDependencyOverrides: DependencyOverrides = {
		//logger: asValue(testLogger),
		logger: asValue(silentLogger),
		pubsub: asFunction(createMockPubSubClient, SINGLETON_CONFIG),
		edgeConfig: asFunction(buildMockEdgeConfig),
	}

	const dependencyOverrides = {
		...defaultDependencyOverrides,
		...opts?.dependencyOverrides,
	}

	/*
	 *fastify-plugin ensures that all decorators
	 *are exposed for testing purposes, this is
	 *different from the production setup
	 */
	await fastify.register(fp(App), {
		config: { ...config, ...opts?.config },
		dependencyOverrides,
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

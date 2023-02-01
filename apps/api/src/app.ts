import { diContainer, fastifyAwilixPlugin } from '@fastify/awilix'
import Cors from '@fastify/cors'
import Helmet from '@fastify/helmet'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { asValue } from 'awilix'
import { FastifyPluginAsync } from 'fastify'
import NoIcon from 'fastify-no-icon'

import { Config } from './infra/config'
import { DependencyOverrides, registerDependencies } from './infra/diConfig'
import HealthcheckDeps from './infra/healthcheck/deps'
import Healthcheck from './infra/healthcheck/server'
import Ratelimit from './infra/ratelimit'
import Session from './infra/session'
import { AccountRoutes } from './modules/accounts/routes'
import { appRouter, createContext, onError, responseMeta } from './trpc'
import { schemas } from './utils/schema/zodJsonSchema'

type AppProps = {
	config: Config
	dependencyOverrides?: DependencyOverrides
}

export const app: FastifyPluginAsync<AppProps> = async (
	fastify,
	{ config, dependencyOverrides = {} },
): Promise<void> => {
	fastify.register(
		Helmet,
		config.env.IS_PROD ? { contentSecurityPolicy: false } : {},
	)
	fastify.register(fastifyAwilixPlugin, { disposeOnClose: true })
	registerDependencies(
		diContainer,
		{
			app: fastify,
			logger: fastify.log,
			config: config,
		},
		dependencyOverrides,
	)

	fastify.register(Healthcheck, config)
	fastify.register(Ratelimit, {
		...config.rateLimit,
		redis: diContainer.cradle.redis,
	})
	fastify.register(HealthcheckDeps, { prefix: config.healthcheckDeps.baseUrl })
	fastify.register(Session, {
		session: config.session,
		sessionRedisStore: {
			...config.sessionRedisStore,
			client: diContainer.cradle.redis as any,
		},
	})

	/*
	 * Register session and other values dependent on req so we don't get stale session data
	 */
	fastify.addHook('onRequest', (req, _, done) => {
		diContainer.register('session', asValue(req.session))
		done()
	})

	fastify.register(Cors, {
		origin: [config.env.FRONTEND_URL],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})

	fastify.register(NoIcon)

	fastify.register(fastifyTRPCPlugin, {
		prefix: config.trpc.endpoint,
		trpcOptions: {
			router: appRouter,
			createContext,
			onError,
			responseMeta,
		},
	})

	for (const schema of schemas) {
		fastify.addSchema(schema)
	}

	fastify.register(AccountRoutes, { prefix: '/api' })
}

export default app

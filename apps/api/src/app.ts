import Cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { FastifyPluginAsync } from 'fastify'

import { Config } from './config'
import HealthcheckDeps from './infra/healthcheck/deps'
import Healthcheck from './infra/healthcheck/server'
import { pg } from './infra/pg/client'
import PgPlugin from './infra/pg/plugin'
import Ratelimit from './infra/ratelimit'
import { redis } from './infra/redis/client'
import Session from './infra/session'
import { appRouter, createContext, onError, responseMeta } from './trpc'

export const app: FastifyPluginAsync<Config> = async (
	fastify,
	config,
): Promise<void> => {
	fastify.register(PgPlugin, pg)
	fastify.register(Healthcheck, config)
	fastify.register(Ratelimit, { ...config.rateLimit, redis })
	fastify.register(HealthcheckDeps, { prefix: config.healthcheckDeps.baseUrl })
	fastify.register(Session, {
		session: config.session,
		sessionRedisStore: { ...config.sessionRedisStore, client: redis as any },
	})

	fastify.register(Cors, {
		origin: [config.env.FRONTEND_URL],
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	})

	fastify.register(fastifyTRPCPlugin, {
		prefix: config.trpc.endpoint,
		trpcOptions: {
			router: appRouter,
			createContext,
			onError,
			responseMeta,
		},
	})
}

export default app

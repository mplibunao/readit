import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import session from '@fastify/session'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import connectRedis, { RedisStoreOptions } from 'connect-redis'
import { FastifyPluginAsync } from 'fastify'

import { Config } from './config'
import healthcheckDeps from './infra/healthcheck/deps'
import healthcheck from './infra/healthcheck/server'
import { pg } from './infra/pg/client'
import pgPlugin from './infra/pg/plugin'
import ratelimit from './infra/ratelimit'
import { redis } from './infra/redis/client'
import { appRouter, createContext, onError, responseMeta } from './trpc'

export const app: FastifyPluginAsync<Config> = async (
	fastify,
	config,
): Promise<void> => {
	fastify.register(pgPlugin, pg)
	fastify.register(healthcheck, config)
	fastify.register(ratelimit, { ...config.rateLimit, redis })
	fastify.register(healthcheckDeps, { prefix: config.healthcheckDeps.baseUrl })
	fastify.register(cookie)
	fastify.register(session, {
		...config.session,
		store: initRedisStore({
			...config.sessionRedisStore,
			client: redis as any,
		}),
	})

	fastify.register(cors, {
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

function initRedisStore(opts: RedisStoreOptions) {
	const RedisStore = connectRedis(session as any)
	return new RedisStore(opts) as any
}

export default app

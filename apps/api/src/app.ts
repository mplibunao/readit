import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { FastifyPluginAsync } from 'fastify'

import { Config } from './config'
import healthcheck from './infra/healthcheck'
import { pg } from './infra/pg/client'
import pgPlugin from './infra/pg/plugin'
import { appRouter, createContext, onError, responseMeta } from './trpc'

export const app: FastifyPluginAsync<Config> = async (
	fastify,
	config,
): Promise<void> => {
	fastify.register(pgPlugin, pg)
	fastify.register(healthcheck, config)

	fastify.register(cors, {
		origin: [
			'http://localhost:3000',
			'https://readit.staging.mplibunao.tech',
			'https://readit.mplibunao.tech',
		],
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

	// broken
	//if (config.trpc.enablePlayground) {
	//fastify.register(
	//await getFastifyPlugin({
	//playgroundEndpoint: config.trpc.playgroundEndpoint,
	//trpcApiEndpoint: config.trpc.endpoint,
	//router: appRouter,
	//}),
	//{ prefix: config.trpc.playgroundEndpoint }
	//)
	//}
}

export default app

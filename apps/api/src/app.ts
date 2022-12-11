import { FastifyPluginAsync } from 'fastify'
import { Config } from './config'
import healthcheck from './infra/healthcheck'
import pg from './infra/pg/plugin'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter } from './trpc'

export const app: FastifyPluginAsync<Config> = async (
	fastify,
	config
): Promise<void> => {
	fastify.register(pg, config.pg)
	fastify.register(healthcheck, config)

	fastify.register(fastifyTRPCPlugin, {
		prefix: config.trpc.endpoint,
		trpcOptions: { router: appRouter },
	})

	if (config.trpc.enablePlayground) {
		const { getFastifyPlugin } = await import(
			'trpc-playground/handlers/fastify'
		)
		fastify.register(
			await getFastifyPlugin({
				playgroundEndpoint: config.trpc.playgroundEndpoint,
				trpcApiEndpoint: config.trpc.endpoint,
				router: appRouter,
			}),
			{ prefix: config.trpc.playgroundEndpoint }
		)
	}
}

export default app

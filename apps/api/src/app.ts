import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { Config } from './config'
import healthcheck from './infra/healthcheck'
import pg from './infra/pg/plugin'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { appRouter, Context, createContext } from './trpc'
import { ProcedureType, TRPCError } from '@trpc/server'

type OnErrorParams = {
	error: TRPCError
	path?: string
	ctx?: Context
	input: unknown
	req: FastifyRequest
	type: ProcedureType | 'unknown'
}

export const app: FastifyPluginAsync<Config> = async (
	fastify,
	config
): Promise<void> => {
	fastify.register(pg, config.pg)
	fastify.register(healthcheck, config)

	fastify.register(fastifyTRPCPlugin, {
		prefix: config.trpc.endpoint,
		trpcOptions: {
			router: appRouter,
			createContext,
			onError: ({ error, path, req, input, type }: OnErrorParams) => {
				if (['INTERNAL_SERVER_ERROR'].includes(error.code)) {
					req.log.error(
						{ error, input, type },
						`Something went wrong on ${path}`
					)
				} else {
					req.log.warn(
						{ error, input, type },
						`Something went wrong on ${path}`
					)
				}
			},
		},
	})

	/*
	 * main branch has the fastify fix but uses v9 trpc
	 * @next branch works with v10 but doesn't have the fix for a fastify bug
	 *if (config.trpc.enablePlayground) {
	 *  const { getFastifyPlugin } = await import(
	 *    'trpc-playground/handlers/fastify'
	 *  )
	 *  fastify.register(
	 *    await getFastifyPlugin({
	 *      playgroundEndpoint: config.trpc.playgroundEndpoint,
	 *      trpcApiEndpoint: config.trpc.endpoint,
	 *      router: appRouter,
	 *    }),
	 *    { prefix: config.trpc.playgroundEndpoint }
	 *  )
	 *}
	 */
}

export default app

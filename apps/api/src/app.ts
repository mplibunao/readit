import cors from '@fastify/cors'
import { ProcedureType, TRPCError } from '@trpc/server'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

import { Config } from './config'
import healthcheck from './infra/healthcheck'
import pg from './infra/pg/plugin'
import { appRouter, Context, createContext } from './trpc'

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
	config,
): Promise<void> => {
	fastify.register(pg, config.pg)
	fastify.register(healthcheck, config)

	fastify.register(cors, {
		origin: '*',
	})

	fastify.register(fastifyTRPCPlugin, {
		prefix: config.trpc.endpoint,
		trpcOptions: {
			router: appRouter,
			createContext,
			onError: ({ error, path, req, input, type }: OnErrorParams) => {
				if (error.code === 'INTERNAL_SERVER_ERROR') {
					req.log.fatal(
						{ error, input, type },
						`Something went wrong on ${path}`,
					)
				} else if (
					error.code === 'BAD_REQUEST' &&
					error.cause instanceof ZodError
				) {
					req.log.info(
						`zod validation error on ${path}`,
						error.cause.flatten(),
						{ error, input, type },
					)
				} else {
					req.log.error(
						{ error, input, type },
						`Something went wrong on ${path}`,
					)
				}
			},
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

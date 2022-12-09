import { FastifyPluginAsync } from 'fastify'
import { Config } from './config'
import healthcheck from './infra/healthcheck'
import pg from './infra/pg/plugin'

export const app: FastifyPluginAsync<Config> = async (
	fastify,
	config
): Promise<void> => {
	fastify.register(pg, config.pg)
	fastify.register(healthcheck, config)
}

export default app

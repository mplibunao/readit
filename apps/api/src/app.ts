import { FastifyPluginAsync } from 'fastify'
import { Config } from './config'

export const app: FastifyPluginAsync<Config> = async (
	fastify,
	config
): Promise<void> => {
	fastify.register(healthcheck, config)
}

export default app

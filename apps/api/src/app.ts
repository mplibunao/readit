import { FastifyPluginAsync } from 'fastify'
import { Config } from './config'
import infra from './infra'

export const app: FastifyPluginAsync<Config> = async (
	fastify,
	config
): Promise<void> => {
	fastify.register(infra, config)
}

export default app

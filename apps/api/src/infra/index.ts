import { Config } from '@/config'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import healthcheck from './healthcheck'

const infrastructure: FastifyPluginAsync<Config> = async (fastify, config) => {
	fastify.register(healthcheck, config)
}

export default fp(infrastructure, {
	name: 'infrastructure',
})

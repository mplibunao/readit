import { FastifyPluginAsync } from 'fastify'

import { confirmEmailRoute } from '../events/confirmEmail.consumer'

export const AccountRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(confirmEmailRoute, { prefix: '/events' })
}

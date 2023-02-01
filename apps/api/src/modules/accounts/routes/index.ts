import { FastifyPluginAsync } from 'fastify'

import { confirmEmailSubscriberRoute } from '../events/confirmEmail.subscriber'

export const AccountRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(confirmEmailSubscriberRoute, { prefix: '/events' })
}

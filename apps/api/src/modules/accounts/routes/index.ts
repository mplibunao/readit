import { FastifyPluginAsync } from 'fastify'

import { accountEventsSubscriberRoutes } from './accountEvent.route'
import { authRoutes } from './auth.route'

export const AccountRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(accountEventsSubscriberRoutes, { prefix: '/events' })
	fastify.register(authRoutes, { prefix: '/auth' })
}

import { FastifyPluginAsync } from 'fastify'

import { confirmEmailSubscriberRoute } from '../events/confirmEmail.subscriber'
import { loginBasicEmailSubscriberRoute } from '../events/loginBasicAuthEmail.subscriber'
import { accountEmailRoutes } from './accountEmail.route'

export const AccountRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(confirmEmailSubscriberRoute, { prefix: '/events' })
	fastify.register(loginBasicEmailSubscriberRoute, { prefix: '/events' })
	fastify.register(accountEmailRoutes)
}

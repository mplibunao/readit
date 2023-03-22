import { FastifyPluginAsync } from 'fastify'

import { AccountRoutes } from './accounts/routes'

export const apiRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.register(AccountRoutes)
}

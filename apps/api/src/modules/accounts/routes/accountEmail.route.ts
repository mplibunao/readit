import { $ref } from '@api/utils/schema/zodJsonSchema'
import { FastifyPluginAsync } from 'fastify'

import { confirmEmailHandler } from '../controllers/accountEmail.controller'

export const accountEmailRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.route({
		name: 'confirmEmail',
		url: '/confirm-email/:token',
		method: 'GET',
		schema: {
			params: $ref('confirmEmailInput'),
		},
		handler: confirmEmailHandler,
	})
}

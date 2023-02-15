import { $ref } from '@api/utils/schema/zodJsonSchema'
import { FastifyPluginAsync } from 'fastify'

import {
	confirmEmailHandler,
	verifyLoginTokenHandler,
} from '../controllers/accountEmail.controller'

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

	fastify.route({
		name: 'verifyLoginToken',
		url: '/verify-login/:token',
		method: 'GET',
		schema: {
			params: $ref('loginBasicAuthInput'),
		},
		handler: verifyLoginTokenHandler,
	})
}

import { $ref } from '@api/utils/schema/zodJsonSchema'
import { FastifyPluginAsync } from 'fastify'

import {
	changeEmailHandler,
	confirmEmailHandler,
	getOAuthUrl,
	handleOauthCallback,
	verifyLoginTokenHandler,
} from '../controllers/auth.controller'

export const authRoutes: FastifyPluginAsync = async (fastify) => {
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

	fastify.route({
		name: 'changeEmail',
		url: '/change-email/:token/:newEmail',
		method: 'GET',
		schema: {
			params: $ref('changeEmailInput'),
		},
		handler: changeEmailHandler,
	})

	fastify.route({
		name: 'oAuthCallback',
		url: '/oauth/:provider/callback',
		method: 'GET',
		schema: {
			params: $ref('oAuthCallbackParams'),
			querystring: $ref('oAuthCallbackQs'),
		},
		handler: handleOauthCallback,
	})

	fastify.route({
		name: 'getOAuthUrl',
		url: '/oauth/:provider/login',
		schema: {
			params: $ref('oAuthCallbackParams'),
		},
		method: 'GET',
		handler: getOAuthUrl,
	})
}

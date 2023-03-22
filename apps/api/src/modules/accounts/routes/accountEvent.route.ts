import { errorSchema, responseStatusOk } from '@api/utils/schema/schema'
import { $ref } from '@api/utils/schema/zodJsonSchema'
import { FastifyPluginAsync } from 'fastify'

import {
	forgotPasswordEmail,
	sendChangeEmail,
	sendConfirmEmail,
	sendLoginTokenEmail,
} from '../events/accountEvents.subscriber'

const pubsubSubscriberSchema = {
	body: $ref('pubSubPushSchema'),
	response: {
		'2xx': responseStatusOk,
		'4xx': errorSchema,
		'500': errorSchema,
	},
}

export const accountEventsSubscriberRoutes: FastifyPluginAsync = async (
	fastify,
) => {
	fastify.route({
		name: 'confirmEmailSubscriber',
		url: '/confirm-email',
		method: 'POST',
		schema: pubsubSubscriberSchema,
		handler: sendConfirmEmail,
	})

	fastify.route({
		name: 'loginBasicEmailSubscriber',
		url: '/login-basic-email',
		method: 'POST',
		schema: pubsubSubscriberSchema,
		handler: sendLoginTokenEmail,
	})

	fastify.route({
		name: 'changeEmailSubscriber',
		url: '/change-email',
		method: 'POST',
		schema: pubsubSubscriberSchema,
		handler: sendChangeEmail,
	})

	fastify.route({
		name: 'changePasswordSubscriber',
		url: '/forgot-password-email',
		method: 'POST',
		schema: pubsubSubscriberSchema,
		handler: forgotPasswordEmail,
	})
}

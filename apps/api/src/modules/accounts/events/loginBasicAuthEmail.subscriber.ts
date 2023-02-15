import { PubSubPushSchema } from '@api/infra/pubsub/PubSubService'
import { handleRESTServiceErrors } from '@api/utils/errors/handleRESTServiceErrors'
import { errorSchema, responseStatusOk } from '@api/utils/schema/schema'
import { $ref } from '@api/utils/schema/zodJsonSchema'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
	publishLoginBasicAuthSchema,
	PublishLoginBasicAuthSchema,
} from '../dtos/email.dto'

export const loginBasicEmailSubscriberRoute: FastifyPluginAsync = async (
	fastify,
) => {
	fastify.route({
		name: 'loginBasicEmailSubscriber',
		url: '/login-basic-email',
		method: 'POST',
		schema: {
			body: $ref('pubSubPushSchema'),
			response: {
				'2xx': responseStatusOk,
				'4xx': errorSchema,
				'500': errorSchema,
			},
		},
		handler: async function (req: FastifyRequest<{ Body: PubSubPushSchema }>) {
			const { logger, PubSubService, UserService, MailerService } =
				req.diScope.cradle
			try {
				const message =
					PubSubService.decodePushMessage<PublishLoginBasicAuthSchema>(
						req.body,
						publishLoginBasicAuthSchema,
					)
				const user = await UserService.findById(message.userId)
				const data = await MailerService.sendLoginBasicAuth(user)
				return { status: data }
			} catch (error) {
				return handleRESTServiceErrors(error, logger)
			}
		},
	})
}

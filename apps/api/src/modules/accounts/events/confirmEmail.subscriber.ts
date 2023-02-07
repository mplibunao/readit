import { PubSubPushSchema } from '@api/infra/pubsub/PubSubService'
import { handleRESTServiceErrors } from '@api/utils/errors/handleRESTServiceErrors'
import { errorSchema, responseStatusOk } from '@api/utils/schema/schema'
import { $ref } from '@api/utils/schema/zodJsonSchema'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
	PublishRegisterUserSchema,
	publishRegisterUserSchema,
} from '../dtos/email.dto'

export const confirmEmailSubscriberRoute: FastifyPluginAsync = async (
	fastify,
) => {
	fastify.route({
		name: 'confirmEmailSubscriber',
		url: '/confirm-email',
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
			const { UserService, MailerService, PubSubService, logger } =
				req.diScope.cradle

			try {
				const message =
					PubSubService.decodePushMessage<PublishRegisterUserSchema>(
						req.body,
						publishRegisterUserSchema,
					)
				const user = await UserService.findById(message.userId)

				const data = await MailerService.sendConfirmEmail(user)
				return { status: data }
			} catch (error) {
				return handleRESTServiceErrors(error, logger)
			}
		},
	})
}

import { PubSubPushSchema } from '@api/infra/pubsub/PubSubService'
import { handleRESTServiceErrors } from '@api/utils/errors/handleRESTServiceErrors'
import { errorSchema, responseStatusOk } from '@api/utils/schema/schema'
import { $ref } from '@api/utils/schema/zodJsonSchema'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'

import {
	ConfirmEmailSubscriberInput,
	confirmEmailSubscriberInput,
} from '../dtos/email.dto'

export const CONFIRM_EMAIL_TOPIC = 'CONFIRM_EMAIL'

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
					PubSubService.decodePushMessage<ConfirmEmailSubscriberInput>(
						req.body,
						confirmEmailSubscriberInput,
					)
				const user = await UserService.findById(message.userId)
				const profileUrl = UserService.getProfileUrl(user.username)

				const data = await MailerService.sendConfirmEmail({
					profileUrl,
					...user,
				})
				return { status: data }
			} catch (error) {
				return handleRESTServiceErrors(error, logger)
			}
		},
	})
}

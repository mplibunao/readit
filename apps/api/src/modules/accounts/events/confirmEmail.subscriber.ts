import { SendConfirmEmailError } from '@api/infra/mailer/email.errors'
import { PubSubPushSchema } from '@api/infra/pubsub/PubSubService'
import { errorSchema, responseStatusOk } from '@api/utils/schema/schema'
import { $ref } from '@api/utils/schema/zodJsonSchema'
import { until } from '@open-draft/until'
import { AppError } from '@readit/utils'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import createError from 'http-errors'
import { ZodError } from 'zod'

import {
	SendConfirmEmailInput,
	sendConfirmEmailInput,
} from '../domain/accounts.events.dto'
import { FindByIdError, UserNotFound } from '../domain/user.errors'

export const CONFIRM_EMAIL_TOPIC = 'CONFIRM_EMAIL'

export const confirmEmailSubscriberRoute: FastifyPluginAsync = async (
	fastify,
) => {
	fastify.route({
		url: '/confirm-email',
		method: 'POST',
		name: 'confirmEmailSubscriber',
		schema: {
			body: $ref('pubSubPushSchema'),
			response: {
				'2xx': responseStatusOk,
				'4xx': errorSchema,
				'500': errorSchema,
			},
		},
		handler: async function (req: FastifyRequest<{ Body: PubSubPushSchema }>) {
			const { UserService, MailerService, PubSubService } = req.diScope.cradle
			const { data, error } = await until<
				FindByIdError | SendConfirmEmailError,
				Awaited<Promise<'ok'>>
			>(async () => {
				const message = PubSubService.decodePushMessage<SendConfirmEmailInput>(
					req.body,
					sendConfirmEmailInput,
				)
				const user = await UserService.findById(message.userId)
				const profileUrl = UserService.getProfileUrl(user.username)

				return MailerService.sendConfirmEmail({ profileUrl, ...user })
			})

			if (error) {
				if (error instanceof ZodError) {
					return createError(400, error)
				}

				if (error instanceof AppError && error.constructor === UserNotFound) {
					return createError(404, error)
				}

				return createError(500, error)
			}

			return { status: data }
		},
	})
}

import { SendConfirmEmailError } from '@api/infra/mailer/email.errors'
import { errorSchema, responseStatusOk } from '@api/utils/schema'
import { until } from '@open-draft/until'
import { AppError } from '@readit/utils'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import createError from 'http-errors'
import { ZodError } from 'zod'

import { SendConfirmEmailInput } from '../domain/accounts.events.dto'
import { $ref } from '../domain/accounts.schemas'
import { FindByIdError, UserNotFound } from '../domain/user.errors'

export const CONFIRM_EMAIL_TOPIC = 'CONFIRM_EMAIL'

export const confirmEmailRoute: FastifyPluginAsync = async (fastify) => {
	fastify.post(
		'/confirm-email',
		{
			schema: {
				body: $ref('sendConfirmEmailInput'),
				response: {
					'2xx': responseStatusOk,
					'4xx': errorSchema,
					'500': errorSchema,
				},
			},
		},
		async function (req: FastifyRequest<{ Body: SendConfirmEmailInput }>) {
			const { UserService, MailerService } = req.diScope.cradle
			const { data, error } = await until<
				FindByIdError | SendConfirmEmailError,
				Awaited<Promise<'ok'>>
			>(async () => {
				const user = await UserService.findById(req.body.userId)
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
	)
}

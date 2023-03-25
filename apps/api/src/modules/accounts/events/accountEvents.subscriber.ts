import { PubSubPushSchema } from '@api/infra/pubsub/PubSubService'
import { handleRESTServiceErrors } from '@api/utils/errors/handleRESTServiceErrors'
import { FastifyRequest } from 'fastify'

import {
	publishChangeEmail,
	PublishChangeEmail,
	publishLoginBasicAuthSchema,
	PublishLoginBasicAuthSchema,
	PublishRegisterUserSchema,
	publishRegisterUserSchema,
	publishForgotPasswordSchema,
	PublishForgotPasswordSchema,
} from '../dtos/email.dto'

export const sendConfirmEmail = async function (
	req: FastifyRequest<{ Body: PubSubPushSchema }>,
) {
	const { UserService, MailerService, PubSubService, logger } =
		req.diScope.cradle

	try {
		const message = PubSubService.decodePushMessage<PublishRegisterUserSchema>(
			req.body,
			publishRegisterUserSchema,
		)
		const user = await UserService.findById(message.userId)

		const data = await MailerService.sendConfirmEmail(user)
		return { status: data }
	} catch (error) {
		return handleRESTServiceErrors(error, logger)
	}
}

export const sendLoginTokenEmail = async function (
	req: FastifyRequest<{ Body: PubSubPushSchema }>,
) {
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
}

export const sendChangeEmail = async function (
	req: FastifyRequest<{ Body: PubSubPushSchema }>,
) {
	const { logger, PubSubService, UserService, MailerService } =
		req.diScope.cradle
	try {
		const message = PubSubService.decodePushMessage<PublishChangeEmail>(
			req.body,
			publishChangeEmail,
		)
		const user = await UserService.findById(message.userId)
		const data = await Promise.all([
			MailerService.sendChangeEmail(user, message.newEmail),
			MailerService.sendChangedEmail(user, message.newEmail),
		])
		return { status: data }
	} catch (error) {
		return handleRESTServiceErrors(error, logger)
	}
}

export const forgotPasswordEmail = async function (
	req: FastifyRequest<{ Body: PubSubPushSchema }>,
) {
	const { logger, PubSubService, UserService, MailerService } =
		req.diScope.cradle
	try {
		const message =
			PubSubService.decodePushMessage<PublishForgotPasswordSchema>(
				req.body,
				publishForgotPasswordSchema,
			)
		const user = await UserService.findById(message.userId)
		const data = await MailerService.sendForgotPasswordEmail(user)
		return { status: data }
	} catch (error) {
		return handleRESTServiceErrors(error, logger)
	}
}

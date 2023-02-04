import { handleRESTServiceErrors } from '@api/utils/errors/handleRESTServiceErrors'
import { FastifyReply, FastifyRequest } from 'fastify'

import { ConfirmEmailInput } from '../dtos/email.dto'

export const confirmEmailHandler = async function (
	req: FastifyRequest<{ Params: ConfirmEmailInput }>,
	reply: FastifyReply,
) {
	const { UserService, config, logger } = req.diScope.cradle
	try {
		await UserService.confirmEmail(req.params.token)
		return reply.redirect(config.env.FRONTEND_URL)
	} catch (error) {
		return handleRESTServiceErrors(error, logger)
	}
}

import { getRedirectError } from '@api/utils/errors/handleRedirectErrors'
import { FastifyReply, FastifyRequest } from 'fastify'

import { ConfirmEmailInput, LoginBasicAuthInput } from '../dtos/email.dto'

export const confirmEmailHandler = async function (
	req: FastifyRequest<{ Params: ConfirmEmailInput }>,
	reply: FastifyReply,
) {
	const { UserService, config, logger } = req.diScope.cradle
	try {
		await UserService.confirmEmail(req.params.token)
		return reply.redirect(config.env.FRONTEND_URL)
	} catch (error) {
		return reply.redirect(
			`${config.env.FRONTEND_URL}${getRedirectError(error, logger)}`,
		)
	}
}

export const verifyLoginTokenHandler = async function (
	req: FastifyRequest<{ Params: LoginBasicAuthInput }>,
	reply: FastifyReply,
) {
	const { UserService, logger, config } = req.diScope.cradle
	try {
		await UserService.verifyLoginToken({
			id: req.params.token,
			session: req.session,
		})
		return reply.redirect(config.env.FRONTEND_URL)
	} catch (error) {
		return reply.redirect(
			`${config.env.FRONTEND_URL}${getRedirectError(error, logger)}`,
		)
	}
}

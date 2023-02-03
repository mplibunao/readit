import { handleRESTServiceErrors } from '@api/utils/errors/handleRESTServiceErrors'
import { until } from '@open-draft/until'
import { FastifyReply, FastifyRequest } from 'fastify'

import { ConfirmEmailInput } from '../domain/email.dto'
import { ConfirmUserError } from '../domain/user.errors'

export const confirmEmailHandler = async function (
	req: FastifyRequest<{ Params: ConfirmEmailInput }>,
	reply: FastifyReply,
) {
	const { UserService, config, logger } = req.diScope.cradle
	const { error } = await until<ConfirmUserError, Awaited<Promise<'ok'>>>(() =>
		UserService.confirmEmail(req.params.token),
	)

	if (error) return handleRESTServiceErrors(error, logger)

	return reply.redirect(config.env.FRONTEND_URL)
}

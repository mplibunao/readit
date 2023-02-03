import { until } from '@open-draft/until'
import { AppError } from '@readit/utils'
import { FastifyReply, FastifyRequest } from 'fastify'
import createError from 'http-errors'
import { ZodError } from 'zod'

import { ConfirmEmailInput } from '../domain/email.dto'
import { InvalidToken, TokenNotFound } from '../domain/token.errors'
import {
	ConfirmUserError,
	TokenAlreadyUsed,
	UserAlreadyConfirmed,
	UserNotFound,
} from '../domain/user.errors'

export const confirmEmailHandler = async function (
	req: FastifyRequest<{ Params: ConfirmEmailInput }>,
	reply: FastifyReply,
) {
	const { UserService, config } = req.diScope.cradle
	const { error } = await until<ConfirmUserError, Awaited<Promise<'ok'>>>(() =>
		UserService.confirmEmail(req.params.token),
	)

	if (error) {
		if (error instanceof ZodError) createError(400, error)
		if (error instanceof AppError) {
			switch (error.constructor) {
				case TokenNotFound:
				case UserNotFound:
					return createError(404, error)
				case InvalidToken:
					return createError(400, error)
				case TokenAlreadyUsed:
				case UserAlreadyConfirmed:
					return createError(409, error)
				default:
					return createError(500, error)
			}
		}
	}

	return reply.redirect(config.env.FRONTEND_URL)
}

import { getRedirectError } from '@api/utils/errors/handleRedirectErrors'
import { FastifyReply, FastifyRequest } from 'fastify'

import { StateParameterMismatch } from '../domain/oAuth.errors'
import {
	ChangeEmailInput,
	ConfirmEmailInput,
	LoginBasicAuthInput,
} from '../dtos/email.dto'
import { OAuthCallbackParams, OAuthCallbackQs } from '../dtos/user.dto'

export const confirmEmailHandler = async function (
	req: FastifyRequest<{ Params: ConfirmEmailInput }>,
	reply: FastifyReply,
) {
	const { AuthService, config, logger } = req.diScope.cradle
	try {
		await AuthService.confirmEmail(req.params.token)
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
	const { AuthService, logger, config } = req.diScope.cradle
	try {
		await AuthService.verifyLoginToken({
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

export const changeEmailHandler = async function (
	req: FastifyRequest<{ Params: ChangeEmailInput }>,
	reply: FastifyReply,
) {
	const { AuthService, logger, config } = req.diScope.cradle
	try {
		await AuthService.changeEmail({
			tokenId: req.params.token,
			session: req.session,
			newEmail: req.params.newEmail,
		})
		return reply.redirect(`${config.env.FRONTEND_URL}/settings`)
	} catch (error) {
		return reply.redirect(
			`${config.env.FRONTEND_URL}${getRedirectError(error, logger)}`,
		)
	}
}

export const handleOauthCallback = async function (
	req: FastifyRequest<{
		Params: OAuthCallbackParams
		Querystring: OAuthCallbackQs
	}>,
	reply: FastifyReply,
) {
	const { logger, config, OAuthService } = req.diScope.cradle
	const oauthFormUrl = `${config.env.FRONTEND_URL}/register/oauth`
	try {
		if (req.query.state !== req.session.oauthState) {
			throw new StateParameterMismatch({})
		}

		const decodedState = OAuthService.decodeState(req.query.state)

		if (req.params.provider === 'google') {
			const { status, user, social } = await OAuthService.verifyGoogleUser(
				req.query.code,
				decodedState,
			)
			req.session.oauthState = undefined
			if (status === 'loggedIn' && user) {
				req.session.user = { id: user.id }
				return reply.redirect(config.env.FRONTEND_URL)
			}
			if (status === 'newPartialUser') {
				req.session.partialUser = { user, social }
				return reply.redirect(`${oauthFormUrl}/google`)
			}
		} else if (req.params.provider === 'facebook') {
			const { status, user, social } = await OAuthService.verifyFacebookUser(
				req.query.code,
				decodedState,
			)
			req.session.oauthState = undefined
			if (status === 'loggedIn' && user) {
				req.session.user = { id: user.id }
				return reply.redirect(config.env.FRONTEND_URL)
			}
			if (status === 'newPartialUser') {
				req.session.partialUser = { user, social }
				return reply.redirect(`${oauthFormUrl}/facebook`)
			}
		} else if (req.params.provider === 'discord') {
			const { status, user, social } = await OAuthService.verifyDiscordUser(
				req.query.code,
				decodedState,
			)
			req.session.oauthState = undefined
			if (status === 'loggedIn' && user) {
				req.session.user = { id: user.id }
				return reply.redirect(config.env.FRONTEND_URL)
			}
			if (status === 'newPartialUser') {
				req.session.partialUser = { user, social }
				return reply.redirect(`${oauthFormUrl}/discord`)
			}
		}
		throw new Error(`Invalid provider: ${req.params.provider}`)
	} catch (error) {
		return reply.redirect(
			`${config.env.FRONTEND_URL}${getRedirectError(error, logger)}`,
		)
	}
}

export const getOAuthUrl = async function (
	req: FastifyRequest<{ Params: OAuthCallbackParams }>,
	reply: FastifyReply,
) {
	const { logger, config, OAuthService } = req.diScope.cradle
	try {
		const state = OAuthService.generateState(req.session.user?.id)
		const url = OAuthService.getOAuthUrl({
			provider: req.params.provider,
			state,
		})
		req.session.oauthState = state
		return reply.redirect(url)
	} catch (error) {
		return reply.redirect(
			`${config.env.FRONTEND_URL}${getRedirectError(error, logger)}`,
		)
	}
}

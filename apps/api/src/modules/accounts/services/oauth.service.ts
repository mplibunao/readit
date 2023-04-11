import { Dependencies } from '@api/infra/diConfig'
import { Session } from '@api/infra/session'
import { AppError, InternalServerError } from '@api/utils/errors/baseError'
import axios from 'axios'
import { randomBytes } from 'crypto'
import { z } from 'zod'

import {
	FailedToGetOAuthToken,
	FailedToGetOAuthUser,
	OAuthAccountNotVerified,
	SocialAlreadyConnectedToAnotherAccount,
	SocialNotOwnedByUser,
} from '../domain/oAuth.errors'
import { OAuthSchemas } from '../domain/oAuth.schema'
import { UserAlreadyExists } from '../domain/user.errors'

export type OAuthServiceType = ReturnType<typeof buildOAuthService>

export const GOOGLE_OAUTH_URL_PREFIX =
	'https://accounts.google.com/o/oauth2/v2/auth'
export const DISCORD_OAUTH_URL_PREFIX =
	'https://discord.com/api/oauth2/authorize'

export const buildOAuthService = ({
	config,
	logger,
	SocialAccountRepository,
	pg,
	UserRepository,
}: Dependencies) => {
	const { google, discord } = config.oauth

	const generateState = (userId?: string) => {
		const state: OAuthSchemas.OAuthState = {
			nonce: randomBytes(16).toString('base64'),
			timestamp: new Date().getTime(),
		}

		if (userId) {
			state.userId = userId
		}
		const encodedState = Buffer.from(JSON.stringify(state)).toString('base64')
		return encodedState
	}

	const decodeState = z
		.function()
		.args(z.string())
		.returns(OAuthSchemas.oAuthState)
		.implement((state) => {
			return JSON.parse(
				Buffer.from(state, 'base64').toString('ascii'),
			) as OAuthSchemas.OAuthState
		})

	const getOAuthUrl = z
		.function()
		.args(z.object({ provider: OAuthSchemas.provider, state: z.string() }))
		.returns(z.string())
		.implement(({ provider, state }) => {
			switch (provider) {
				case 'google':
					return getGoogleOAuthUrl(state)
				case 'discord':
					return getDiscordOAuthUrl(state)
				default:
					throw new InternalServerError({ message: 'Invalid provider' })
			}
		})

	const getGoogleOAuthUrl = (state: string) => {
		const options = {
			redirect_uri: google.redirectUrl,
			client_id: google.clientId,
			access_type: 'offline',
			response_type: 'code',
			prompt: 'consent',
			scope: [
				'https://www.googleapis.com/auth/userinfo.email',
				'https://www.googleapis.com/auth/userinfo.profile',
			].join(' '),
			state,
		}

		const searchParams = new URLSearchParams(options)
		return `${GOOGLE_OAUTH_URL_PREFIX}?${searchParams.toString()}`
	}

	const getDiscordOAuthUrl = (state: string) => {
		const options = {
			client_id: discord.clientId,
			redirect_uri: discord.redirectUrl,
			response_type: 'code',
			scope: ['identify', 'email'].join(' '),
			state,
		}

		const searchParams = new URLSearchParams(options)

		return `${DISCORD_OAUTH_URL_PREFIX}?${searchParams.toString()}`
	}

	const formatDiscordAvatar = z
		.function()
		.args(
			z.object({
				discordUser: OAuthSchemas.getDiscordUserOutput,
				ext: OAuthSchemas.discordAvatarExt,
			}),
		)
		.returns(z.string().url().nullable())
		.implement(({ discordUser, ext }) => {
			if (discordUser.avatar) {
				return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${ext}`
			}
			return null
		})

	const getDiscordOAuthToken = z
		.function()
		.args(OAuthSchemas.code)
		.returns(z.promise(OAuthSchemas.getDiscordTokenOutput))
		.implement(async (code: string) => {
			const url = 'https://discord.com/api/v10/oauth2/token'
			const queryString = new URLSearchParams({
				client_id: discord.clientId,
				client_secret: discord.clientSecret,
				grant_type: 'authorization_code',
				code,
				redirect_uri: discord.redirectUrl,
			})

			try {
				const res = await axios.post<OAuthSchemas.GetDiscordTokenOutput>(
					url,
					queryString,
					{
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					},
				)
				return res.data
			} catch (error) {
				logger.error({ code, error }, 'Failed to fetch Discord Oauth Tokens')
				throw new FailedToGetOAuthToken({ cause: error, provider: 'discord' })
			}
		})

	const getDiscordUser = z
		.function()
		.args(OAuthSchemas.discordToken.access_token)
		.returns(z.promise(OAuthSchemas.getDiscordUserOutput))
		.implement(async (accessToken) => {
			try {
				const url = 'https://discord.com/api/v10/users/@me'
				const res = await axios.get<OAuthSchemas.GetDiscordUserOutput>(url, {
					headers: { Authorization: `Bearer ${accessToken}` },
				})
				return res.data
			} catch (error) {
				logger.error({ error, accessToken }, 'Failed to fetch Discord user')
				throw new FailedToGetOAuthUser({ cause: error, provider: 'discord' })
			}
		})

	const getGoogleOAuthToken = z
		.function()
		.args(OAuthSchemas.code)
		.returns(z.promise(OAuthSchemas.getGoogleTokenOutput))
		.implement(async (code) => {
			const url = 'https://oauth2.googleapis.com/token'

			const queryString = new URLSearchParams({
				code,
				client_id: google.clientId,
				client_secret: google.clientSecret,
				redirect_uri: google.redirectUrl,
				grant_type: 'authorization_code',
			}).toString()

			try {
				const res = await axios.post<OAuthSchemas.GetGoogleTokenOutput>(
					url,
					queryString,
					{
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded',
						},
					},
				)
				return res.data
			} catch (error) {
				logger.error({ error, code }, 'Failed to fetch Google Oauth Tokens')
				throw new FailedToGetOAuthToken({ cause: error, provider: 'google' })
			}
		})

	const getGoogleUser = z
		.function()
		.args(OAuthSchemas.getGoogleUserInput)
		.returns(z.promise(OAuthSchemas.getGoogleUserOutput))
		.implement(async ({ id_token, access_token }) => {
			try {
				const url = 'https://www.googleapis.com/oauth2/v1/userinfo'
				const res = await axios.get<OAuthSchemas.GetGoogleUserOutput>(
					`${url}?alt=json&access_token=${access_token}`,
					{
						headers: {
							Authorization: `Bearer ${id_token}`,
						},
					},
				)
				return res.data as OAuthSchemas.GetGoogleUserOutput
			} catch (error) {
				logger.error(
					{ error, id_token, access_token },
					'Error fetching Google user',
				)
				throw new FailedToGetOAuthUser({ cause: error, provider: 'google' })
			}
		})

	const mapGoogleUserToUser = async (
		googleUser: OAuthSchemas.GetGoogleUserOutput,
	): Promise<OAuthSchemas.GooglePartialUser> => ({
		firstName: googleUser.given_name,
		lastName: googleUser.family_name,
		email: googleUser.email,
		imageUrl: googleUser.picture,
	})

	const mapDiscordUserToUser = async (
		discordUser: OAuthSchemas.GetDiscordUserOutput,
	): Promise<OAuthSchemas.DiscordPartialUser> => ({
		email: discordUser.email as string,
		username: discordUser.username,
		imageUrl: formatDiscordAvatar({ discordUser }),
	})

	const verifyGoogleUser = z
		.function()
		.args(z.string(), OAuthSchemas.oAuthState)
		.returns(z.promise(OAuthSchemas.verifyGoogleUserOutput))
		.implement(async (code, state) => {
			try {
				const { id_token, access_token } = await getGoogleOAuthToken(code)
				const googleUser = (await getGoogleUser({
					id_token,
					access_token,
				})) as OAuthSchemas.GetGoogleUserOutput

				const socialAccount = await SocialAccountRepository.findBySocialId(
					googleUser.id,
				)
				if (socialAccount) {
					// If user is logged in and connecting a social account already connected to another account
					// Otherwise, if user isn't logged in, then we can just log the user in without conflicts
					if (state.userId && socialAccount.userId !== state.userId) {
						throw new SocialAlreadyConnectedToAnotherAccount({})
					} else {
						return { user: socialAccount, status: 'loggedIn' }
					}
				}

				if (!googleUser.verified_email) {
					throw new OAuthAccountNotVerified({
						message: 'Your Google account is not verified',
						provider: 'google',
					})
				}

				/*
				 * If user is already logged in using credentials, link the social account to the user regardless if the email is same (this means the user is linking using the settings page)
				 */
				if (state.userId) {
					const user = await UserRepository.findByIdOrThrow(state.userId)

					await SocialAccountRepository.create({
						userId: user.id,
						socialId: googleUser.id,
						provider: 'google',
						usernameOrEmail: googleUser.email,
					})

					return {
						user,
						status: 'loggedIn',
					}
				}

				/*
				 * First time logging in using this social account
				 * Check if basic auth with same email exists then link the social account to that
				 * Or create a new user/social account after completing the registration form
				 */
				const user = await UserRepository.findByEmail(googleUser.email)
				if (user) {
					await SocialAccountRepository.create({
						provider: 'google',
						socialId: googleUser.id,
						userId: user.id,
						usernameOrEmail: googleUser.email,
					})

					if (!user.imageUrl) {
						return {
							status: 'loggedIn',
							user: await UserRepository.updateTakeOne({
								where: { id: user.id },
								data: { imageUrl: googleUser.picture },
							}),
						}
					} else {
						return { user, status: 'loggedIn' }
					}
				} else {
					return {
						status: 'newPartialUser',
						user: await mapGoogleUserToUser(googleUser),
						social: {
							provider: 'google',
							socialId: googleUser.id,
							usernameOrEmail: googleUser.email,
						},
					}
				}
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ error, code },
						`Error verifying and upserting OAuth user: ${error.type}`,
					)
					throw error
				}
				logger.error(
					{ error, code },
					`Error verifying and upserting OAuth user`,
				)
				throw new InternalServerError({ cause: error })
			}
		})

	const verifyDiscordUser = z
		.function()
		.args(z.string(), OAuthSchemas.oAuthState)
		.returns(z.promise(OAuthSchemas.verifyDiscordUserOutput))
		.implement(async (code, state) => {
			try {
				const { access_token } = await getDiscordOAuthToken(code)
				const discordUser = await getDiscordUser(access_token)

				const socialAccount = await SocialAccountRepository.findBySocialId(
					discordUser.id,
				)
				if (socialAccount) {
					if (state.userId && socialAccount.userId !== state.userId) {
						throw new SocialAlreadyConnectedToAnotherAccount({})
					} else {
						return { user: socialAccount, status: 'loggedIn' }
					}
				}

				if (!discordUser.email || !discordUser.verified) {
					throw new OAuthAccountNotVerified({
						message: 'Discord account is not linked to a verified email',
						provider: 'discord',
					})
				}

				/*
				 * If user is already logged in using credentials, link the social account to the user regardless if the email is same (this means the user is linking using the settings page)
				 */
				if (state.userId) {
					const user = await UserRepository.findByIdOrThrow(state.userId)

					await SocialAccountRepository.create({
						userId: user.id,
						socialId: discordUser.id,
						provider: 'discord',
						usernameOrEmail: discordUser.username,
					})

					return {
						user,
						status: 'loggedIn',
					}
				}

				const user = await UserRepository.findByEmail(discordUser.email)
				if (user) {
					await SocialAccountRepository.create({
						provider: 'discord',
						socialId: discordUser.id,
						userId: user.id,
						usernameOrEmail: discordUser.username,
					})

					if (!user.imageUrl) {
						return {
							status: 'loggedIn',
							user: await UserRepository.updateTakeOne({
								where: { id: user.id },
								data: {
									imageUrl: formatDiscordAvatar({ discordUser }),
								},
							}),
						}
					} else {
						return { status: 'loggedIn', user }
					}
				} else {
					return {
						status: 'newPartialUser',
						user: await mapDiscordUserToUser(discordUser),
						social: {
							provider: 'discord',
							socialId: discordUser.id,
							usernameOrEmail: discordUser.username,
						},
					}
				}
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ error, code },
						`Error verifying and upserting OAuth user: ${error.type}`,
					)
					throw error
				}
				logger.error(
					{ error, code },
					`Error verifying and upserting OAuth user`,
				)
				throw new InternalServerError({ cause: error })
			}
		})

	const unlinkSocialAccount = async ({
		session,
		id,
	}: {
		session: Session
		id: string
	}) => {
		try {
			const social = await SocialAccountRepository.findByIdOrThrow(id)

			if (social.userId !== session.user?.id) {
				throw new SocialNotOwnedByUser({})
			}

			await SocialAccountRepository.removeByIdOrThrow(id)
			return social.provider
		} catch (error) {
			if (error instanceof AppError) {
				logger.error(
					{ error, id, session },
					`Error unlinking social account: ${error.type}`,
				)
			}
			logger.error({ error, id, session }, `Error unlinking social account`)
			throw new InternalServerError({ cause: error })
		}
	}

	const createUserFromSocial = z
		.function()
		.args(OAuthSchemas.createOAuthUserInput)
		.returns(z.promise(OAuthSchemas.createOAuthUserOutput))
		.implement(async ({ social, user }) => {
			try {
				const userByEmail = await UserRepository.findByEmail(user.email)

				if (userByEmail) {
					logger.error(
						{ ...userByEmail, email: user.email },
						'User with email already exists',
					)
					throw new UserAlreadyExists({})
				}
				const result = await pg.transaction().execute(async (trx) => {
					const createdUser = await UserRepository.create(
						{ ...user, confirmedAt: 'NOW' },
						trx,
					)
					const socialAccount = await SocialAccountRepository.create(
						{
							...social,
							userId: createdUser.id,
						},
						trx,
					)
					return { user: createdUser, socialAccount }
				})

				return result
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ user, social, error },
						`Failed to create user from OAuth user: ${error.type}`,
					)
					throw error
				}
				logger.error(
					{ user, social, error },
					'Failed to create user from OAuth user',
				)
				throw new InternalServerError({ cause: error })
			}
		})

	return {
		verifyDiscordUser,
		verifyGoogleUser,
		getOAuthUrl,
		generateState,
		decodeState,
		unlinkSocialAccount,
		createUserFromSocial,
	}
}

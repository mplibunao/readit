import { z } from 'zod'

import { Env } from './config'

export const oAuthEnvSchema = {
	OAUTH_GOOGLE_CLIENT_ID: z.string(),
	OAUTH_GOOGLE_CLIENT_SECRET: z.string(),
	OAUTH_FACEBOOK_CLIENT_ID: z.string(),
	OAUTH_FACEBOOK_CLIENT_SECRET: z.string(),
	OAUTH_DISCORD_CLIENT_ID: z.string(),
	OAUTH_DISCORD_CLIENT_SECRET: z.string(),
	OAUTH_BASE_REDIRECT_URL: z.string(),
}

type Credentials = {
	clientId: string
	clientSecret: string
	redirectUrl: string
}

export type OAuthConfig = {
	google: Credentials
	facebook: Credentials
	discord: Credentials
}

export const getOAuthConfig = (env: Env): OAuthConfig => ({
	google: {
		clientId: env.OAUTH_GOOGLE_CLIENT_ID,
		clientSecret: env.OAUTH_GOOGLE_CLIENT_SECRET,
		redirectUrl: `${env.OAUTH_BASE_REDIRECT_URL}/google/callback`,
	},
	facebook: {
		clientId: env.OAUTH_FACEBOOK_CLIENT_ID,
		clientSecret: env.OAUTH_FACEBOOK_CLIENT_SECRET,
		redirectUrl: `${env.OAUTH_BASE_REDIRECT_URL}/facebook/callback`,
	},
	discord: {
		clientId: env.OAUTH_DISCORD_CLIENT_ID,
		clientSecret: env.OAUTH_DISCORD_CLIENT_SECRET,
		redirectUrl: `${env.OAUTH_BASE_REDIRECT_URL}/discord/callback`,
	},
})

import { apiBaseUrl } from '../utils/url'

export const OAUTH_DISABLED = {
	discord: false,
	google: true,
}

export const OAUTH_URL = {
	discord: OAUTH_DISABLED.discord
		? '#'
		: `${apiBaseUrl}/auth/oauth/discord/login`,
	google: OAUTH_DISABLED.google ? '#' : `${apiBaseUrl}/auth/oauth/google/login`,
}

export type Provider = 'discord' | 'google'

export const providers: Provider[] = ['discord', 'google']

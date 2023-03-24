import { apiBaseUrl } from '../utils/url'

export const OAUTH_URL = {
	discord: `${apiBaseUrl}/auth/oauth/discord/login`,
	google: `${apiBaseUrl}/auth/oauth/google/login`,
}

export type Provider = 'discord' | 'google'

export const providers: Provider[] = ['discord', 'google']

import { apiBaseUrl } from '../utils/url'

export const OAUTH_URL = {
	discord: `${apiBaseUrl}/auth/oauth/discord/login`,
	google: `${apiBaseUrl}/auth/oauth/google/login`,
	facebook: `${apiBaseUrl}/auth/oauth/facebook/login`,
}

export type Provider = 'discord' | 'google' | 'facebook'

export const providers: Provider[] = ['discord', 'google', 'facebook']

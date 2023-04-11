import { Session } from '@api/infra/session'
import { BaseContext } from '@api/test/baseContext'
import { build } from '@api/test/build'
import { describe, beforeEach, test, expect } from 'vitest'

import {
	DISCORD_OAUTH_URL_PREFIX,
	GOOGLE_OAUTH_URL_PREFIX,
} from '../../services/oauth.service'

interface Context extends BaseContext {
	session: Session
}

describe('getOauthUrl', () => {
	beforeEach<Context>(async (ctx) => {
		const fastify = await build()

		ctx.fastify = fastify
	})

	test<Context>('should redirect to the correct oauth url for google', async ({
		fastify,
	}) => {
		const res = await fastify.inject({
			method: 'GET',
			url: fastify.reverse('getOAuthUrl', {
				fullUrl: true,
				args: { provider: 'google' },
			}),
		})

		expect(res.statusCode).toBe(302)
		expect(res.headers['location']).toContain(GOOGLE_OAUTH_URL_PREFIX)
	})

	test<Context>('should redirect to the correct oauth url for discord', async ({
		fastify,
	}) => {
		const res = await fastify.inject({
			method: 'GET',
			url: fastify.reverse('getOAuthUrl', {
				fullUrl: true,
				args: { provider: 'discord' },
			}),
		})

		expect(res.statusCode).toBe(302)
		expect(res.headers['location']).toContain(DISCORD_OAUTH_URL_PREFIX)
	})

	test<Context>('Redirect url should always include an encrypted state query param to prevent CSRF', async ({
		fastify,
	}) => {
		const res = await fastify.inject({
			method: 'GET',
			url: fastify.reverse('getOAuthUrl', {
				fullUrl: true,
				args: { provider: 'discord' },
			}),
		})

		expect(res.statusCode).toBe(302)
		const url = new URL(res.headers['location'] as string)
		expect(url.searchParams.get('state')).toBeDefined()
	})
})

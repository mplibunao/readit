import { Config } from '@api/config'
import Cookie from '@fastify/cookie'
import Session from '@fastify/session'
import connectRedis, { RedisStoreOptions } from 'connect-redis'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { z } from 'zod'

declare module 'fastify' {
	interface Session {
		readsid: string
	}
}

export const sessionEnvSchema = {
	SESSION_SECRET: z.string(),
	SESSION_COOKIE_NAME: z
		.string()
		.optional()
		.default('readsid')
		.describe(
			'Name of session cookie. Try to use an ambiguous name to make it harder for attackers',
		),
	SESSION_COOKIE_PREFIX: z
		.string()
		.optional()
		.default('s:')
		.describe('For express compatibility'),
	SESSION_COOKIE_MAX_AGE: z
		.number()
		.positive()
		.optional()
		.describe('In MS. Defaults to 24 hours')
		.default(1000 * 60 * 60 * 24),
	SESSION_SECURE_COOKIE: z
		.boolean()
		.optional()
		.default(true)
		.describe('Set to false for unencrypted HTTP connection'),
	SESSION_COOKIE_SAME_SITE: z
		.enum(['lax', 'strict', 'none'])
		.optional()
		.default('lax')
		.describe('CSRF. Use atleast lax'),
	SESSION_COOKIE_DOMAIN: z.string().optional().describe('Domain for cookie'),
	SESSION_SAVE_UNINITIALIZED: z
		.boolean()
		.optional()
		.default(false)
		.describe(
			'Save session to store, even when they are new and not modified. False-can save storage space and comply with the EU cookie law',
		),
	SESSION_STORE_DISABLE_TOUCH: z
		.boolean()
		.optional()
		.default(false)
		.describe(
			'https://github.com/tj/connect-redis#disabletouch. Used to prevent the session from expiring if the user is interacting with the application. If perf/cost reduction is more important than security consider setting this to true along with a really long cookie max age like 10 years to reduce load on session store',
		),
}

type SessionOpts = {
	session: Config['session']
	sessionRedisStore: Config['sessionRedisStore']
}

const plugin: FastifyPluginAsync<SessionOpts> = async (fastify, config) => {
	fastify.register(Cookie)
	fastify.register(Session, {
		...config.session,
		store: initRedisStore(config.sessionRedisStore),
	})
}

export default fp(plugin, {
	name: 'session',
})

function initRedisStore(opts: RedisStoreOptions) {
	const RedisStore = connectRedis(Session as any)
	return new RedisStore(opts) as any
}

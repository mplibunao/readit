import { Config, Env } from '@api/infra/config'
import {
	GooglePartialUser,
	OAuthSchemas,
	DiscordPartialUser,
} from '@api/modules/accounts/domain/oAuth.schema'
import Cookie from '@fastify/cookie'
import Session from '@fastify/session'
import connectRedis, { RedisStoreOptions } from 'connect-redis'
import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import { z } from 'zod'

type UserSession = {
	id: string
}

type PartialUser = {
	user: GooglePartialUser | DiscordPartialUser
	social: OAuthSchemas.CreateSocialInput
}

declare module 'fastify' {
	interface Session {
		user?: UserSession
		partialUser?: PartialUser
		oauthState?: string
	}
}

export type Session = FastifyRequest['session']

// This is separate from the sessionEnvSchema so we can use this as a definition and hijack the json schema output
export const SESSION_SECRET = z
	.string()
	.describe(
		'Secret for session encryption. Override this at the json schema level and add separator:, to allow passing of comma-separated string. This is so we can use arrays and rotate secrets. Note: First index in the array is used to sign new cookies and is the first to be checked for incoming cookies. This means that you have to gradually push the old keys and keep the new keys in index 0',
	)

export const sessionEnvSchema = {
	SESSION_SECRET,
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

export const getSessionOpts = (env: Env): Config['session'] => ({
	secret: env.SESSION_SECRET,
	cookieName: env.SESSION_COOKIE_NAME,
	cookiePrefix: env.SESSION_COOKIE_PREFIX, // for compatibility with express
	cookie: {
		maxAge: env.SESSION_COOKIE_MAX_AGE,
		httpOnly: true,
		secure: env.SESSION_SECURE_COOKIE,
		sameSite: env.SESSION_COOKIE_SAME_SITE,
		domain: env.SESSION_COOKIE_DOMAIN,
	},
	saveUninitialized: env.SESSION_SAVE_UNINITIALIZED,
})

export const getSessionRedisStoreOpts = (
	env: Env,
): Config['sessionRedisStore'] => ({
	disableTouch: env.SESSION_STORE_DISABLE_TOUCH,
})

import {
	routeResponseSchemaOpts,
	UnderPressure,
} from '@api/infra/healthcheck/server'
import { PgClientOpts } from '@api/infra/pg/client'
import { rateLimitEnvSchema } from '@api/infra/ratelimit'
import { redisEnvSchema, RedisOpts } from '@api/infra/redis/createClient'
import { sessionEnvSchema } from '@api/infra/session'
import { RateLimitOptions } from '@fastify/rate-limit'
import { FastifySessionOptions } from '@fastify/session'
import { FlagsServiceOptions } from '@readit/flags'
import { kyselyPGEnvSchema } from '@readit/kysely-pg-config'
import { LoggerOpts, loggerOptsEnvSchema } from '@readit/logger'
import { PortSchema } from '@readit/utils'
import { RedisStoreOptions } from 'connect-redis'
import envSchema from 'env-schema'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

const edgeConfigEnvSchema = {
	EDGE_CONFIG: z
		.string()
		.optional()
		.describe('Connection string for edge config'),
	VERCEL_ENV: z.enum(['production', 'preview', 'development']),
	APP_NAME: z.string(),
}

const healthcheckEnvSchema = {
	HEALTHCHECK_BASE_URL: z.string().optional().default('/health'),

	/*
	 *max heap threshold to return 503 service unavaliable to prevent taking down your server
	 *463 MB for a 512 MB instance
	 *Using a high value since we're using cloud run so we can afford for the servers to get overloaded
	 *50 MB is what node:18.7.0-alpine uses on an empty container
	 *20 is overhead for other parts of the memory like new space
	 */
	HEALTHCHECK_MAX_HEAP_USED: z
		.number()
		.optional()
		.default((512 - 50 - 20) * 1024 * 1024),

	/*
	 *512 MB
	 *Resident Set Size – the amount of memory allocated in the v8 context
	 */
	HEALTHCHECK_MAX_RSS: z
		.number()
		.optional()
		.default(512 * 1024 * 1024)
		.describe(
			'Resident Set Size – the amount of memory allocated in the v8 context',
		),
	HEALTHCHECK_MAX_EVENT_LOOP_UTILIZATION: z.number().optional().default(0.98),
	HEALTHCHECK_MAX_EVENT_LOOP_DELAY: z.number().optional().default(1000),
}

const zodEnvSchema = z.object({
	...kyselyPGEnvSchema,
	...loggerOptsEnvSchema,
	...redisEnvSchema,
	...healthcheckEnvSchema,
	...edgeConfigEnvSchema,
	...rateLimitEnvSchema,
	...sessionEnvSchema,
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: PortSchema.default(4000),
	API_HOST: z.string().optional().default('127.0.0.1'),
	FRONTEND_URL: z.string(),
	TRPC_ENDPOINT: z.string(),
})

const jsonSchema = zodToJsonSchema(zodEnvSchema, { errorMessages: true })

export type Env = z.infer<typeof zodEnvSchema>

const getDotEnv = () => {
	if (Boolean(process.env.CI) || process.env.NODE_ENV === 'production') {
		return false
	}

	if (process.env.NODE_ENV === 'test') {
		return {
			path: '.env.test',
		}
	}

	return true
}

const env = envSchema<Env>({
	dotenv: getDotEnv(),
	schema: jsonSchema,
	data: process.env,
})

export interface Config {
	env: Env
	app: {
		version: string
		name: string
	}
	fastify: {
		trustProxy: boolean
		maxParamLength?: number
	}
	server: {
		host?: string
		port: number
	}
	loggerOpts: LoggerOpts
	trpc: {
		endpoint: string
	}
	pg: PgClientOpts
	redis: RedisOpts
	underPressure: UnderPressure
	healthcheckDeps: {
		baseUrl: string
	}
	rateLimit: RateLimitOptions
	edgeConfig: Omit<FlagsServiceOptions, 'flagsRepo'> & {
		connectionString: Env['EDGE_CONFIG']
		env: Env['VERCEL_ENV']
	}
	session: FastifySessionOptions
	sessionRedisStore: RedisStoreOptions
}

export const config: Config = {
	env,
	app: {
		version: env.APP_VERSION,
		name: env.APP_NAME,
	},
	fastify: {
		trustProxy: true,
		// for trpc
		maxParamLength: 5000,
	},
	server: {
		port: env.PORT,
		// listen to all ipv4 addresses in cloud run
		host: env.K_SERVICE ? '0.0.0.0' : env.API_HOST,
	},
	loggerOpts: env,
	trpc: {
		endpoint: env.TRPC_ENDPOINT,
	},
	pg: env,
	redis: env,
	underPressure: {
		version: env.APP_VERSION,
		maxHeapUsedBytes: env.HEALTHCHECK_MAX_HEAP_USED,
		maxRssBytes: env.HEALTHCHECK_MAX_RSS,
		maxEventLoopUtilization: env.HEALTHCHECK_MAX_EVENT_LOOP_UTILIZATION,
		maxEventLoopDelay: env.HEALTHCHECK_MAX_EVENT_LOOP_DELAY,
		exposeStatusRoute: {
			routeResponseSchemaOpts,
			url: `${env.HEALTHCHECK_BASE_URL}/server`,
			routeOpts: {
				logLevel: 'debug',
			},
		},
	},
	healthcheckDeps: {
		baseUrl: env.HEALTHCHECK_BASE_URL,
	},
	edgeConfig: {
		connectionString: env.EDGE_CONFIG,
		appName: env.APP_NAME,
		env: env.VERCEL_ENV,
	},
	rateLimit: {
		max: env.RATELIMIT_MAX,
		timeWindow: env.RATELIMIT_TIMEWINDOW,
	},
	session: {
		secret: env.SESSION_SECRET,
		cookieName: env.SESSION_COOKIE_NAME,
		cookiePrefix: env.SESSION_COOKIE_PREFIX, // for compatibility with express
		cookie: {
			maxAge: env.SESSION_COOKIE_MAX_AGE, // 10 years
			httpOnly: true,
			secure: env.SESSION_SECURE_COOKIE,
			sameSite: env.SESSION_COOKIE_SAME_SITE,
			domain: env.SESSION_COOKIE_DOMAIN,
		},
		saveUninitialized: env.SESSION_SAVE_UNINITIALIZED,
	},
	sessionRedisStore: {
		disableTouch: env.SESSION_STORE_DISABLE_TOUCH,
	},
}

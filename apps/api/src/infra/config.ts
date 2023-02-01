import {
	getUnderPressureOpts,
	healthcheckEnvSchema,
	UnderPressure,
} from '@api/infra/healthcheck/server'
import { getRateLimitOpts, rateLimitEnvSchema } from '@api/infra/ratelimit'
import {
	getRedisClientOpts,
	redisEnvSchema,
	RedisOpts,
} from '@api/infra/redis/client'
import {
	getSessionOpts,
	getSessionRedisStoreOpts,
	sessionEnvSchema,
} from '@api/infra/session'
import { RateLimitOptions } from '@fastify/rate-limit'
import { FastifySessionOptions } from '@fastify/session'
import { FlagsServiceOptions } from '@readit/flags'
import { kyselyPGEnvSchema, KyselyPGSchema } from '@readit/kysely-pg-config'
import { getLoggerConfig, loggerOptsEnvSchema } from '@readit/logger'
import { PortSchema } from '@readit/utils'
import { RedisStoreOptions } from 'connect-redis'
import envSchema from 'env-schema'
import { PinoLoggerOptions } from 'fastify/types/logger'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

import { edgeConfigEnvSchema, getEdgeConfigOpts } from './flags'
import {
	getPostmarkOpts,
	PostmarkConfig,
	postmarkEnvSchema,
} from './mailer/postmarkClient'

const zodEnvSchema = z.object({
	...kyselyPGEnvSchema,
	...loggerOptsEnvSchema,
	...redisEnvSchema,
	...healthcheckEnvSchema,
	...edgeConfigEnvSchema,
	...rateLimitEnvSchema,
	...sessionEnvSchema,
	...postmarkEnvSchema,
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: PortSchema.default(4000),
	API_HOST: z.string().optional().default('127.0.0.1'),
	FRONTEND_URL: z.string(),
	TRPC_ENDPOINT: z.string(),
	API_URL: z.string(),
	GCP_PROJECT_ID: z.string(),
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
		logger: PinoLoggerOptions
	}
	server: {
		host?: string
		port: number
	}
	trpc: {
		endpoint: string
	}
	pg: KyselyPGSchema
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
	postmark: PostmarkConfig
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
		logger: getLoggerConfig({
			APP_NAME: env.APP_NAME,
			APP_VERSION: env.APP_VERSION,
			IS_PROD: env.IS_PROD,
			LOGGING_LEVEL: env.LOGGING_LEVEL,
			K_SERVICE: env.K_SERVICE,
		}),
	},
	server: {
		port: env.PORT,
		// listen to all ipv4 addresses in cloud run
		host: env.K_SERVICE ? '0.0.0.0' : env.API_HOST,
	},
	trpc: {
		endpoint: env.TRPC_ENDPOINT,
	},
	pg: env,
	redis: getRedisClientOpts(env),
	underPressure: getUnderPressureOpts(env),
	healthcheckDeps: {
		baseUrl: env.HEALTHCHECK_BASE_URL,
	},
	edgeConfig: getEdgeConfigOpts(env),
	rateLimit: getRateLimitOpts(env),
	session: getSessionOpts(env),
	sessionRedisStore: getSessionRedisStoreOpts(env),
	postmark: getPostmarkOpts(env),
}

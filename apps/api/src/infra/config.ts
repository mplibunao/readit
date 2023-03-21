import {
	getUnderPressureOpts,
	healthcheckEnvSchema,
	UnderPressure,
} from '@api/infra/healthcheck/server'
import { getRateLimitOpts, rateLimitEnvSchema } from '@api/infra/ratelimit'
import { getRedisClientOpts, redisEnvSchema, RedisOpts } from '@api/infra/redis'
import {
	getSessionOpts,
	getSessionRedisStoreOpts,
	sessionEnvSchema,
	SESSION_SECRET,
} from '@api/infra/session'
import { getTrpcOpts, TrpcEnvSchema, trpcEnvSchema } from '@api/trpc/envSchema'
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
} from './mailer/client/postmarkClient'
import { OAuthConfig, getOAuthConfig, oAuthEnvSchema } from './oauth'

const zodEnvSchema = z.object({
	...kyselyPGEnvSchema,
	...loggerOptsEnvSchema,
	...redisEnvSchema,
	...healthcheckEnvSchema,
	...edgeConfigEnvSchema,
	...rateLimitEnvSchema,
	...sessionEnvSchema,
	...postmarkEnvSchema,
	...trpcEnvSchema,
	...oAuthEnvSchema,
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: PortSchema.default(4000),
	API_HOST: z.string().optional().default('127.0.0.1'),
	FRONTEND_URL: z.string().describe('Url of the client'),
	API_SELF_URL: z.string().describe('Url of this api'),
	GCP_PROJECT_ID: z.string(),
	GCP_PUBLIC_ASSET_URL: z.string(),
})

const jsonSchema = zodToJsonSchema(zodEnvSchema, {
	errorMessages: true,
	definitions: { SESSION_SECRET },
})

/*
 *Since I don't know how to generate separator: ',' using zod
 *I'll just hijack the json schema output and add the property before passing the schema to env-schema
 */
if (typeof jsonSchema.definitions!.SESSION_SECRET === 'object') {
	jsonSchema.definitions!.SESSION_SECRET = {
		...jsonSchema.definitions!.SESSION_SECRET,
		separator: ',',
	}
}

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
	trpc: TrpcEnvSchema
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
	oauth: OAuthConfig
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
	trpc: getTrpcOpts(env),
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
	oauth: getOAuthConfig(env),
}

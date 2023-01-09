import { routeResponseSchemaOpts, UnderPressure } from '@api/infra/healthcheck'
import { PgPluginOpts } from '@api/infra/pg'
import { EdgeConfigOptions } from '@readit/edge-config'
import { loadEnv } from '@readit/env'
import { kyselyPGEnvSchema } from '@readit/kysely-pg-config'
import {
	getLoggerConfig,
	LoggerOpts,
	loggerOptsEnvSchema,
} from '@readit/logger'
import { PinoLoggerOptions } from 'fastify/types/logger'
import { parseEnv, port } from 'znv'
import { z } from 'zod'

const redisEnvSchema = {
	REDIS_URL: z.string().url().optional(),
	// https://www.youtube.com/watch?app=desktop&v=0L0ER4pZbX4
	REDIS_ENABLE_AUTO_PIPELINING: z.boolean().optional().default(true),
	// Lower is better for perf, since we don't wait when there are errors
	REDIS_MAX_RETRIES_PER_REQ: z.number().optional().default(20),
	REDIS_CONNECT_TIMEOUT: z.number().optional().default(10_000),
}

const edgeConfigEnvSchema = {
	EDGE_CONFIG: z.string().optional(),
	VERCEL_ENV: z.enum(['production', 'preview', 'development']),
	APP_NAME: z.string(),
}

const healthcheckEnvSchema = {
	HEALTHCHECK_URL: z.string().optional().default('/health'),

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
		.default(512 * 1024 * 1024),
	HEALTHCHECK_MAX_EVENT_LOOP_UTILIZATION: z.number().optional().default(0.98),
	HEALTHCHECK_MAX_EVENT_LOOP_DELAY: z.number().optional().default(1000),
}

const envSchema = {
	...kyselyPGEnvSchema,
	...loggerOptsEnvSchema,
	...redisEnvSchema,
	...healthcheckEnvSchema,
	...edgeConfigEnvSchema,
	NODE_ENV: z.enum(['development', 'production', 'test']),
	PORT: port().default(4000),
	API_HOST: z.string().url().optional().default('127.0.0.1'),
	FRONTEND_URL: z.string().url(),
	TRPC_ENDPOINT: z.string(),
}

loadEnv()

const env = parseEnv(process.env, envSchema)

export type Env = typeof env

export interface Config {
	env: Env
	app: {
		version: string
		name: string
	}
	fastify: {
		trustProxy: boolean
		logger: PinoLoggerOptions
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
	pg: PgPluginOpts
	//redis: FastifyRedisPluginOptions
	underPressure: UnderPressure
	edgeConfig: Omit<EdgeConfigOptions, 'client'> & {
		connectionString: Env['EDGE_CONFIG']
		env: Env['VERCEL_ENV']
	}
}

export const config: Config = {
	env,
	app: {
		version: env.APP_VERSION,
		name: env.APP_NAME,
	},
	fastify: {
		trustProxy: true,
		logger: getLoggerConfig(env),
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
	//redis: {
	//enableAutoPipelining: true,
	//connectTimeout: 500,
	//maxRetriesPerRequest: 1,
	//},
	underPressure: {
		version: env.APP_VERSION,
		maxHeapUsedBytes: env.HEALTHCHECK_MAX_HEAP_USED,
		maxRssBytes: env.HEALTHCHECK_MAX_RSS,
		maxEventLoopUtilization: env.HEALTHCHECK_MAX_EVENT_LOOP_UTILIZATION,
		maxEventLoopDelay: env.HEALTHCHECK_MAX_EVENT_LOOP_DELAY,
		exposeStatusRoute: {
			routeResponseSchemaOpts,
			url: env.HEALTHCHECK_URL,
			routeOpts: {
				logLevel: 'debug',
			},
		},
	},
	edgeConfig: {
		connectionString: env.EDGE_CONFIG,
		appName: env.APP_NAME,
		env: env.VERCEL_ENV,
	},
}

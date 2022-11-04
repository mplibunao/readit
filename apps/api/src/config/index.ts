import { routeResponseSchemaOpts, UnderPressure } from '@/infra/healthcheck'
import { PinoLoggerOptions } from 'fastify/types/logger'
import envSchema from 'env-schema'
import { getLoggerConfig } from './logger'
import { Static, Type } from '@sinclair/typebox'

const envJsonSchema = Type.Object({
	NODE_ENV: Type.Union([
		Type.Literal('development'),
		Type.Literal('production'),
		Type.Literal('test'),
	]),
	PORT: Type.Number({ default: 4000 }),
	CI: Type.Optional(Type.Boolean({ default: false })),
	API_HOST: Type.String(),
	IS_PROD: Type.Boolean(),
	FRONTEND_URL: Type.String(),
	REDIS_HOST: Type.String(),
	REDIS_PORT: Type.Number(),

	//Pass this if you are using `env` for SECRETS_STRATEGY
	REDIS_PASSWORD: Type.Optional(Type.String()),

	//Perf. https://www.youtube.com/watch?app=desktop&v=0L0ER4pZbX4
	REDIS_ENABLE_AUTO_PIPELINING: Type.Optional(Type.Boolean({ default: true })),

	//For rate-limit perf https://github.com/fastify/fastify-rate-limit#options
	REDIS_CONNECT_TIMEOUT: Type.Optional(Type.Number({ default: 500 })),
	REDIS_MAX_RETRIES_PER_REQ: Type.Optional(Type.Number({ default: 1 })),

	//Derived from K_SERVICE env passed by cloud run
	IS_GCP_CLOUD_RUN: Type.Boolean(),
	APP_NAME: Type.String({ default: 'readit-api' }),
	APP_VERSION: Type.String({ default: '0.0.0' }),
	LOGGING_LEVEL: Type.Union(
		[
			Type.Literal('fatal'),
			Type.Literal('error'),
			Type.Literal('warn'),
			Type.Literal('info'),
			Type.Literal('debug'),
			Type.Literal('trace'),
		],
		{ default: 'info' }
	),

	// Strategy to use for managing secrets. Whether to use a managed service like GCP/AWS/Azure secret manager or use env variables (for dev)
	SECRETS_STRATEGY: Type.Optional(
		Type.Union([Type.Literal('env'), Type.Literal('gcp')], { default: 'env' })
	),

	//secret name for database password. Will resolve to process.env[value] for env and use the value to fetch the secret from service for managed strategies
	SECRETS_PG_PASS: Type.String({ default: 'PG_PASS' }),

	//secret name for redis password. Will resolve to process.env[value] for env and use the value to fetch the secret from service for managed strategies
	SECRETS_REDIS_PASS: Type.String({ default: 'REDIS_PASSWORD' }),

	PG_PASS: Type.Optional(Type.String()), //Pass this if you are using `env` for SECRETS_STRATEGY
	PG_HOST: Type.String(),
	PG_PORT: Type.Number(),
	PG_DB: Type.String(),
	PG_USER: Type.String(),
	HEALTHCHECK_URL: Type.Optional(Type.String({ default: '/health' })),

	/*
	 *max heap threshold to return 503 service unavaliable to prevent taking down your server
	 *463 MB for a 512 MB instance
	 *Using a high value since we're using cloud run so we can afford for the servers to get overloaded
	 *50 MB is what node:18.7.0-alpine uses on an empty container
	 *20 is overhead for other parts of the memory like new space
	 */
	HEALTHCHECK_MAX_HEAP_USED: Type.Optional(
		Type.Number({
			default: (512 - 50 - 20) * 1024 * 1024,
		})
	),
	/*
	 *512 MB
	 *Resident Set Size – the amount of memory allocated in the v8 context
	 */
	HEALTHCHECK_MAX_RSS: Type.Optional(
		Type.Number({
			default: 512 * 1024 * 1024,
		})
	),
	HEALTHCHECK_MAX_EVENT_LOOP_UTILIZATION: Type.Optional(
		Type.Number({ default: 0.98 })
	),
	HEALTHCHECK_MAX_EVENT_LOOP_DELAY: Type.Optional(
		Type.Number({ default: 1000 })
	),
	ENABLE_HTTP2: Type.Optional(
		Type.Boolean({
			default: false,
			description: "Note: You can't use this with websockets",
		})
	),
})

//const envJsonSchema = {
//type: 'object',
//properties: {
//NODE_ENV: { type: 'string' },
//PORT: { type: 'number', default: 4000 },
//CI: { type: 'boolean' },
//API_HOST: { type: 'string' },
//IS_PROD: { type: 'boolean' },
//FRONTEND_URL: { type: 'string' },
//REDIS_HOST: { type: 'string' },
//REDIS_PORT: { type: 'number' },
//REDIS_PASSWORD: {
//type: 'string',
//description: 'Pass this if you are using `env` for SECRETS_STRATEGY',
//},
//REDIS_ENABLE_AUTO_PIPELINING: {
//type: 'boolean',
//description:
//'Perf. https://www.youtube.com/watch?app=desktop&v=0L0ER4pZbX4',
//default: true,
//},
//REDIS_CONNECT_TIMEOUT: {
//type: 'number',
//description:
//'For rate-limit perf https://github.com/fastify/fastify-rate-limit#options',
//default: 500,
//},
//REDIS_MAX_RETRIES_PER_REQ: {
//type: 'number',
//description:
//'For rate-limit perf https://github.com/fastify/fastify-rate-limit#options',
//default: 1,
//},
//IS_GCP_CLOUD_RUN: {
//type: 'boolean',
//description: 'Derived from K_SERVICE env passed by cloud run',
//},
//APP_NAME: { type: 'string', default: 'readit-api' },
//APP_VERSION: { type: 'string', default: '0.0.0' },
//LOGGING_LEVEL: {
//type: 'string',
//default: 'info',
//enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
//},
//SECRETS_STRATEGY: {
//type: 'string',
//enum: ['gcp', 'env'],
//description:
//'Strategy to use for managing secrets. Whether to use a managed service like GCP/AWS/Azure secret manager or use env variables (for dev)',
//},
//SECRETS_PG_PASS: {
//type: 'string',
//description:
//'secret name for database password. Will resolve to process.env[value] for env and use the value to fetch the secret from service for managed strategies',
//},
//SECRETS_REDIS_PASS: {
//type: 'string',
//},
//PG_PASS: {
//type: 'string',
//description: 'Pass this if you are using `env` for SECRETS_STRATEGY',
//},
//PG_HOST: { type: 'string' },
//PG_PORT: { type: 'number' },
//PG_DB: { type: 'string' },
//PG_USER: { type: 'string' },
//HEALTHCHECK_URL: { type: 'string', default: '/health' },
//HEALTHCHECK_MAX_HEAP_USED: {
//type: 'number',
//default: (512 - 50 - 20) * 1024 * 1024,
//description:
//'max heap threshold to return 503 service unavaliable to prevent taking down your server',
//// 463 MB for a 512 MB instance
//// Using a high value since we're using cloud run so we can afford for the servers to get overloaded
//// 50 MB is what node:18.7.0-alpine uses on an empty container
//// 20 is overhead for other parts of the memory like new space
//},
//HEALTHCHECK_MAX_RSS: {
//type: 'number',
//default: 512 * 1024 * 1024,
//description:
//'Resident Set Size – the amount of memory allocated in the v8 context',
//// 512 MB
//},
//HEALTHCHECK_MAX_EVENT_LOOP_UTILIZATION: {
//type: 'number',
//default: 0.98,
//},
//HEALTHCHECK_MAX_EVENT_LOOP_DELAY: {
//type: 'number',
//default: 1000,
//},
//ENABLE_HTTP2: {
//type: 'boolean',
//default: false,
//description: "Note: You can't use this with websockets",
//},
//},
//required: [
//'NODE_ENV',
//'PORT',
//'API_HOST',
//'IS_PROD',
//'FRONTEND_URL',
//'IS_GCP_CLOUD_RUN',
//'REDIS_HOST',
//'REDIS_PORT',
//'APP_NAME',
//'APP_VERSION',
//'LOGGING_LEVEL',
//'SECRETS_PG_PASS',
//'SECRETS_REDIS_PASS',
//'PG_HOST',
//'PG_PORT',
//'PG_DB',
//'PG_USER',
//],
//} as const

//export type Env = FromSchema<typeof envJsonSchema>

export type Env = Static<typeof envJsonSchema>

const env = envSchema<Env>({
	dotenv: { path: '.env' },
	schema: envJsonSchema,
	data: {
		...process.env,
		IS_GCP_CLOUD_RUN: process.env.K_SERVICE !== undefined,
	},
})

export interface Config {
	env: Env
	app: {
		version: string
		name: string
	}
	fastify: {
		http2?: boolean
		trustProxy: boolean
		logger: PinoLoggerOptions
		disableRequestLogging: boolean
	}
	server: {
		host?: string
		port: number
	}
	//pg: PostgresjsPluginOptions
	//redis: FastifyRedisPluginOptions
	secretsManager: {
		strategy: Env['SECRETS_STRATEGY']
		secrets: {
			[key: string]: string
		}
	}
	underPressure: UnderPressure
}

export const config: Config = {
	env,
	app: {
		version: env.APP_VERSION,
		name: env.APP_NAME,
	},
	fastify: {
		http2: env.ENABLE_HTTP2,
		trustProxy: true,
		logger: getLoggerConfig(env),
		disableRequestLogging: true,
	},
	server: {
		port: env.PORT,
		// listen to all ipv4 addresses in cloud run
		host: env.IS_GCP_CLOUD_RUN ? '0.0.0.0' : env.API_HOST,
	},
	//pg: {
	//host: env.PG_HOST,
	//port: env.PG_PORT,
	//database: env.PG_DB,
	//username: env.PG_USER,
	//// Idle connection timeout in seconds
	//idle_timeout: 60,
	//// Max number of connections
	//max: 10,
	//},
	//redis: {
	//host: env.REDIS_HOST,
	//port: env.REDIS_PORT,
	//enableAutoPipelining: env.REDIS_ENABLE_AUTO_PIPELINING,
	//connectTimeout: env.REDIS_CONNECT_TIMEOUT,
	//maxRetriesPerRequest: env.REDIS_MAX_RETRIES_PER_REQ,
	//},
	secretsManager: {
		strategy: env.SECRETS_STRATEGY,
		secrets: {
			dbPassword: env.SECRETS_PG_PASS,
			redisPassword: env.SECRETS_REDIS_PASS,
		},
	},
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
}

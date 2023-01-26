import { Config, Env } from '@api/infra/config'
import underPressure, {
	TYPE_EVENT_LOOP_DELAY,
	TYPE_EVENT_LOOP_UTILIZATION,
	TYPE_HEAP_USED_BYTES,
	TYPE_RSS_BYTES,
} from '@fastify/under-pressure'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { z } from 'zod'

/*
 * This plugin is especially useful if you expect an high load
 * on your application, it measures the process load and returns
 * a 503 if the process is undergoing too much stress.
 * Also provides health check
 *
 * WARNING: Don't use an external logger. It seems to break the custom health check feature and only return status: ok
 */

export const routeResponseSchemaOpts = {
	version: { type: 'string' },
	timestamp: { type: 'string', format: 'date-time' },
	metrics: {
		type: 'object',
		properties: {
			eventLoopDelay: { type: 'number' },
			rssBytes: { type: 'number' },
			heapUsed: { type: 'number' },
			eventLoopUtilized: { type: 'number' },
		},
	},
}

export interface UnderPressure extends underPressure.UnderPressureOptions {
	version: string
}

export const healthCheck: FastifyPluginAsync<Config> = async (
	fastify,
	opts,
) => {
	fastify.register(underPressure, {
		...opts.underPressure,
		pressureHandler: (_req, _rep, type, value) => {
			switch (type) {
				case TYPE_HEAP_USED_BYTES:
					fastify.log.warn(`too many heap bytes used: ${value}`)
					break
				case TYPE_RSS_BYTES:
					fastify.log.warn(`too many rss bytes used: ${value}`)
					break
				case TYPE_EVENT_LOOP_UTILIZATION:
					fastify.log.warn(`event loop utilization too high: ${value}`)
					break
				case TYPE_EVENT_LOOP_DELAY:
					fastify.log.warn(`event loop delay too high: ${value}`)
					break
				default:
			}
			/*
			 *if you omit this line, the request will be handled normally
			 *we comment this out since we're using serverless containers so we want to serve the users regardless but want to be log
			 */

			//rep.send('out of memory');
		},
		healthCheck: async (parent: FastifyInstance) => {
			// You can return a boolean here as well. Returning false will probably return an unhealthy status code.
			// Cool but I prefer strings so that I can add multiple alerting policies for server, db, redis and not have everything notifying when 1 component goes down
			const response = {
				version: opts.underPressure.version,
				timestamp: new Date().toISOString(),
				status: 'ok',
				metrics: parent?.memoryUsage(),
			}

			return response
		},
	})
}

export default fp(healthCheck, {
	name: 'healthCheck',
})

export const healthcheckEnvSchema = {
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

export const getUnderPressureOpts = (env: Env): Config['underPressure'] => ({
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
})

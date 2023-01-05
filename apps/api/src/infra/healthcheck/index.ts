import { Config } from '@api/config'
import underPressure, {
	TYPE_EVENT_LOOP_DELAY,
	TYPE_EVENT_LOOP_UTILIZATION,
	TYPE_HEAP_USED_BYTES,
	TYPE_RSS_BYTES,
} from '@fastify/under-pressure'
import { sql } from '@readit/pg'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

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
	db: { type: 'string' },
	//redis: { type: 'string' },
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
				db: await dbCheck(parent),
				//redis: await redisCheck(parent),
			}

			return response
		},
	})
}

export default fp(healthCheck, {
	name: 'healthCheck',
	dependencies: ['pg'],
})

async function dbCheck(server: FastifyInstance) {
	try {
		const result =
			await sql<string>`select 'Hello world!'::TEXT AS message`.execute(
				server.pg,
			)

		if (result.rows.length === 1) return 'ok'
	} catch (err) {
		if (process.env.NODE_ENV !== 'test') {
			server.log.error({ err }, 'failed to read DB during health check')
		}
	}
	return 'fail'
}

//async function redisCheck(server: FastifyInstance) {
//try {
//const response = await server.redis.ping()
//if (response === 'PONG') return 'ok'
//} catch (err) {
//logger.debug({ err }, 'failed to read DB during health check')
//}
//return 'fail'
//}

import fp from 'fastify-plugin'
import underPressure, {
	TYPE_HEAP_USED_BYTES,
	TYPE_RSS_BYTES,
	TYPE_EVENT_LOOP_UTILIZATION,
	TYPE_EVENT_LOOP_DELAY,
} from '@fastify/under-pressure'
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { Config } from '@/config'

/*
 *This plugin is especially useful if you expect an high load
 *on your application, it measures the process load and returns
 *a 503 if the process is undergoing too much stress.
 *Also provides health check
 */

export const routeResponseSchemaOpts = {
	version: { type: 'string' },
	timestamp: { type: 'string', format: 'date-time' },
	//db: { type: 'string' },
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
	opts
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
			return {
				version: opts.underPressure.version,
				timestamp: new Date().toISOString(),
				status: 'ok',
				metrics: parent?.memoryUsage(),
				//db: await dbCheck(parent),
				//redis: await redisCheck(parent),
			}
		},
	})
}

export default fp(healthCheck, {
	name: 'healthCheck',
	//dependencies: ['pg'],
})

//async function dbCheck(server: FastifyInstance) {
//try {
//const result = await server.pg.sql<
//{ message: string }[]
//>`SELECT 'Hello world!'::TEXT AS message`

//if (result.length === 1) return 'ok'
//} catch (err) {
//server.log.debug({ err }, 'failed to read DB during health check')
//}
//return 'fail'
//}

//async function redisCheck(server: FastifyInstance) {
//try {
//const response = await server.redis.ping()
//if (response === 'PONG') return 'ok'
//} catch (err) {
//server.log.debug({ err }, 'failed to read DB during health check')
//}
//return 'fail'
//}
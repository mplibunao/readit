import { Logger } from '@readit/logger'
import { FastifyInstance } from 'fastify'
import Redis from 'ioredis'
import { sql } from 'kysely'

import { PG } from '../pg/createClient'

async function healthcheckDeps(fastify: FastifyInstance) {
	fastify.get(
		'/deps',
		{
			schema: {
				tags: ['healthcheck'],
				description:
					'Healthcheck endpoint to determine if service dependencies are healthy',
				response: {
					200: {
						type: 'object',
						properties: {
							db: { type: 'string' },
							redis: { type: 'string' },
							timestamp: { type: 'string', format: 'date-time' },
						},
					},
				},
			},
		},
		async function (req) {
			const db = await dbCheck(req.diScope.resolve('pg'), req.server.log)
			const redis = await redisCheck(
				req.diScope.resolve('redis'),
				req.server.log,
			)

			return { db, redis, timestamp: new Date().toISOString() }
		},
	)
}

async function dbCheck(pg: PG, logger: Logger) {
	try {
		const result =
			await sql<string>`select 'Hello world!'::TEXT AS message`.execute(pg)

		if (result.rows.length === 1) return 'ok'
	} catch (err) {
		if (process.env.NODE_ENV !== 'test') {
			logger.error({ err }, 'failed to read DB during health check')
		}
	}
	return 'fail'
}

async function redisCheck(redis: Redis, logger: Logger) {
	try {
		const response = await redis.ping()
		if (response === 'PONG') return 'ok'
	} catch (err) {
		if (process.env.NODE_ENV !== 'test') {
			logger.debug({ err }, 'failed to read DB during health check')
		}
	}
	return 'fail'
}

export default healthcheckDeps

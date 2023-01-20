import { FastifyInstance } from 'fastify'
import Redis from 'ioredis'
import { sql } from 'kysely'

import { redis } from '../redis/client'

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
			const db = await dbCheck(req.server)
			const redisStatus = await redisCheck(req.server, redis)

			return { db, redis: redisStatus, timestamp: new Date().toISOString() }
		},
	)
}

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

async function redisCheck(server: FastifyInstance, redis: Redis) {
	try {
		const response = await redis.ping()
		if (response === 'PONG') return 'ok'
	} catch (err) {
		server.log.debug({ err }, 'failed to read DB during health check')
	}
	return 'fail'
}

export default healthcheckDeps

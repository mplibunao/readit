import { build } from '@api/test/build'
import { asFunction, Lifetime } from 'awilix'
import { describe, expect, it } from 'vitest'

import { closePgClient, createPgClient } from '../pg/createClient'
import { closeRedisClient, createRedisClient } from '../redis/client'

describe('healthcheck db', () => {
	it('should return ok for the db field if db is responsive', async () => {
		const baseUrl = '/health'

		const fastify = await build({
			config: {
				healthcheckDeps: { baseUrl },
			},
		})

		const response = await fastify.inject({
			method: 'GET',
			url: `${baseUrl}/deps`,
		})

		expect(response.statusCode).toEqual(200)

		const res = response.json()
		expect(res.db).toEqual('ok')
	})

	it('should return fail for the db field if api failed to connect to db', async () => {
		const baseUrl = '/health'

		const fastify = await build({
			config: {
				healthcheckDeps: { baseUrl },
				pg: {
					APP_NAME: 'test',
					DATABASE_URL:
						'postgres://postgres:postgress@localhost:5432/doesnotexist',
					IS_PROD: false,
					PG_SSL: false,
					PG_IDLE_TIMEOUT_MS: 2000,
				},
			},
			dependencyOverrides: {
				pg: asFunction(createPgClient, {
					dispose: closePgClient,
					lifetime: Lifetime.SCOPED,
				}),
			},
		})

		const response = await fastify.inject({
			method: 'GET',
			url: `${baseUrl}/deps`,
		})

		expect(response.statusCode).toEqual(200)

		const res = response.json()
		expect(res.db).toEqual('fail')
	})

	it('should return fail for the db field if api failed to connect to db to wrong configuration', async () => {
		const baseUrl = '/health'

		const fastify = await build({
			config: {
				healthcheckDeps: { baseUrl },
				pg: {
					DATABASE_URL: process.env.DATABASE_URL as string,
					APP_NAME: 'test',
					IS_PROD: false,
					PG_SSL: true,
					PG_IDLE_TIMEOUT_MS: 2000,
				},
			},
			dependencyOverrides: {
				pg: asFunction(createPgClient, {
					dispose: closePgClient,
					lifetime: Lifetime.SCOPED,
				}),
			},
		})

		const response = await fastify.inject({
			method: 'GET',
			url: `${baseUrl}/deps`,
		})

		expect(response.statusCode).toEqual(200)

		const res = response.json()
		expect(res.db).toEqual('fail')
	})
})

describe('healthcheck redis', () => {
	it('should return ok for the redis field if redis is responsive', async () => {
		const baseUrl = '/health'

		const fastify = await build({
			config: {
				healthcheckDeps: { baseUrl },
			},
		})

		const response = await fastify.inject({
			method: 'GET',
			url: `${baseUrl}/deps`,
		})

		expect(response.statusCode).toEqual(200)

		const res = response.json()
		expect(res.redis).toEqual('ok')
	})

	it('should return fail for the redis field if redis is not', async () => {
		const baseUrl = '/health'

		const fastify = await build({
			config: {
				healthcheckDeps: { baseUrl },
				redis: {
					REDIS_ENABLE_AUTO_PIPELINING: true,
					REDIS_CONNECT_TIMEOUT: 1000,
					REDIS_MAX_RETRIES_PER_REQ: 1,
					REDIS_URL: 'redis://:redisword@localhost:6379',
				},
			},
			dependencyOverrides: {
				redis: asFunction(createRedisClient, {
					dispose: closeRedisClient,
					lifetime: Lifetime.SCOPED,
				}),
			},
		})

		const response = await fastify.inject({
			method: 'GET',
			url: `${baseUrl}/deps`,
		})

		expect(response.statusCode).toEqual(200)

		const res = response.json()
		expect(res.redis).toEqual('fail')
	})
})

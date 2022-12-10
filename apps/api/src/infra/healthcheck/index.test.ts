import { routeResponseSchemaOpts } from '.'
import { build } from '@/helpers/test/build'
import { describe, test, expect } from 'vitest'

describe('health check', () => {
	test('should return response status of 200 with the correct payload', async () => {
		const opts = {
			version: '1.0.0',
			maxHeapUsedBytes: 1_000_000_000,
			maxRssBytes: 1_000_000_000,
			maxEventLoopUtilization: 0.98,
			maxEventLoopDelay: 1_000,
			exposeStatusRoute: {
				routeResponseSchemaOpts,
				url: '/health',
				routeOpts: {
					logLevel: 'debug',
				},
			},
		}

		const fastify = await build({
			config: {
				underPressure: opts,
			},
		})

		const response = await fastify.inject({
			method: 'GET',
			url: opts.exposeStatusRoute.url,
		})

		expect(response.statusCode).toEqual(200)

		const res = response.json()
		expect(res.version).toEqual(opts.version)
		expect(res.timestamp).toBeTypeOf('string')
		expect(res.metrics.eventLoopDelay).toBeTypeOf('number')
		expect(res.metrics.rssBytes).toBeTypeOf('number')
		expect(res.metrics.heapUsed).toBeTypeOf('number')
		expect(res.metrics.eventLoopUtilized).toBeTypeOf('number')
	})

	test('should return ok for the db field if db is responsive', async () => {
		const opts = {
			version: '1.0.0',
			maxHeapUsedBytes: 1_000_000_000,
			maxRssBytes: 1_000_000_000,
			maxEventLoopUtilization: 0.98,
			maxEventLoopDelay: 1_000,
			exposeStatusRoute: {
				routeResponseSchemaOpts,
				url: '/health',
				routeOpts: {
					logLevel: 'debug',
				},
			},
		}

		const fastify = await build({
			config: {
				underPressure: opts,
			},
		})

		const response = await fastify.inject({
			method: 'GET',
			url: opts.exposeStatusRoute.url,
		})

		expect(response.statusCode).toEqual(200)

		const res = response.json()
		expect(res.db).toEqual('ok')
	})

	test('should return 503 if the db is not responsive', async () => {
		const healthOpts = {
			version: '1.0.0',
			maxHeapUsedBytes: 1_000_000_000,
			maxRssBytes: 1_000_000_000,
			maxEventLoopUtilization: 0.98,
			maxEventLoopDelay: 1_000,
			exposeStatusRoute: {
				routeResponseSchemaOpts,
				url: '/health',
				routeOpts: {
					logLevel: 'debug',
				},
			},
		}

		const pgOpts = {
			connectionString:
				'postgres://postgres:postgress@localhost:5432/doesnotexist',
			isProd: false,
		}

		const fastify = await build({
			config: {
				underPressure: healthOpts,
				pg: pgOpts,
			},
		})

		const response = await fastify.inject({
			method: 'GET',
			url: healthOpts.exposeStatusRoute.url,
		})

		const res = response.json()
		expect(response.statusCode).toEqual(503)
	})
})

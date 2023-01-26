import { build } from '@api/test/build'
import { describe, expect, test } from 'vitest'

import { routeResponseSchemaOpts } from './server'

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
})

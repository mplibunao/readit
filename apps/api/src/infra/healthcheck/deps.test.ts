import { build } from '@api/helpers/test/build'
import { describe, expect, test } from 'vitest'

describe('healthcheck deps', () => {
	test('should return ok for the db field if db is responsive', async () => {
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

	test('should return ok for the redis field if redis is responsive', async () => {
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
})

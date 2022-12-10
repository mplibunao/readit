import { build } from '@/helpers/test/build'
import { sql } from 'kysely'
import { test, describe, expect } from 'vitest'

describe('pg plugin', () => {
	test('Should be able to connect to database and query it', async () => {
		const fastify = await build()
		const res = await sql<number>`select 1+1 AS result`.execute(fastify.pg)
		expect(res.rows[0]).toStrictEqual({ result: 2 })
	})
})
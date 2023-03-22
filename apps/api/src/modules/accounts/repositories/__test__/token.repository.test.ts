import { build } from '@api/test/build'
import { MINUTE_IN_SECONDS } from '@api/utils/date'
import { randomUUID } from 'crypto'
import type { FastifyInstance } from 'fastify'
import { beforeEach, describe, expect, test } from 'vitest'

describe('TokenRepository', () => {
	let fastify: FastifyInstance

	beforeEach(async () => {
		fastify = await build()
	})

	describe('get', () => {
		test('should return undefined for non-existing token', async () => {
			const { TokenRepository } = fastify.diContainer.cradle
			expect(TokenRepository.get('tokenid')).resolves.toBe(undefined)
		})

		test('should return value for existing token', async () => {
			const { TokenRepository } = fastify.diContainer.cradle
			const token = {
				id: randomUUID(),
				userId: randomUUID(),
				type: 'login' as const,
			}
			TokenRepository.set(token.id, token, MINUTE_IN_SECONDS * 1)
			expect(TokenRepository.get(token.id)).resolves.toEqual(token)
		})
	})

	describe('del', () => {
		test('should return undefined for deleted token', async () => {
			const { TokenRepository } = fastify.diContainer.cradle
			const token = {
				id: randomUUID(),
				userId: randomUUID(),
				type: 'login' as const,
			}
			TokenRepository.set(token.id, token, MINUTE_IN_SECONDS * 1)
			expect(TokenRepository.del(token.id)).resolves.toBe(true)
			expect(TokenRepository.get(token.id)).resolves.toBe(undefined)
		})

		test('should return false for non-existing token', async () => {
			const { TokenRepository } = fastify.diContainer.cradle
			expect(TokenRepository.del(randomUUID())).resolves.toBe(false)
		})
	})
})

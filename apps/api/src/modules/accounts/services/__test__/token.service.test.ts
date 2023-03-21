import { build } from '@api/test/build'
import { randomUUID } from 'crypto'
import type { FastifyInstance } from 'fastify'
import { beforeEach, expect, describe, test } from 'vitest'

import { TokenNotFound } from '../../domain/token.errors'

describe('TokenService', () => {
	let fastify: FastifyInstance

	beforeEach(async () => {
		fastify = await build()
	})

	describe('create', () => {
		test('should be able to store and return a token', async () => {
			const { TokenService } = fastify.diContainer.cradle
			const token = { type: 'login' as const, userId: randomUUID() }

			const createdToken = await TokenService.create({
				...token,
				expirationTimeInSeconds: 60,
			})
			expect(createdToken).toMatchObject(token)
			expect(TokenService.get(createdToken.id)).resolves.toMatchObject(token)
		})
	})

	describe('get', () => {
		test('should be able to get a token using the id', async () => {
			const { TokenService } = fastify.diContainer.cradle
			const token = { type: 'login' as const, userId: randomUUID() }

			const createdToken = await TokenService.create({
				...token,
				expirationTimeInSeconds: 60,
			})
			expect(TokenService.get(createdToken.id)).resolves.toMatchObject(token)
		})

		test('should throw a TokenNotFound error if the token does not exist', async () => {
			const { TokenService } = fastify.diContainer.cradle
			expect(TokenService.get('invalid')).rejects.toThrow(TokenNotFound)
		})
	})

	describe('delete', () => {
		test('should be able to delete a token using the id and return true', async () => {
			const { TokenService } = fastify.diContainer.cradle
			const token = { type: 'login' as const, userId: randomUUID() }

			const createdToken = await TokenService.create({
				...token,
				expirationTimeInSeconds: 60,
			})
			expect(TokenService.get(createdToken.id)).resolves.toMatchObject(token)
			expect(TokenService.del(createdToken.id)).resolves.toBe(true)
			expect(TokenService.get(createdToken.id)).rejects.toThrow(TokenNotFound)
		})

		test('should throw a TokenNotFound error if the token being deleted does not exist', async () => {
			const { TokenService } = fastify.diContainer.cradle
			expect(TokenService.del('invalid')).rejects.toThrow(TokenNotFound)
		})
	})
})

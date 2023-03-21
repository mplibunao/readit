import { build } from '@api/test/build'
import {
	createSocialAccount,
	createTestUser,
} from '@api/test/fixtures/accounts'
import { randomUUID } from 'crypto'
import type { FastifyInstance } from 'fastify'
import { beforeEach, describe, expect, test } from 'vitest'

import { UserNotFound } from '../../domain/user.errors'

type Ctx = {
	fastify: FastifyInstance
}

describe('UserRepository', () => {
	beforeEach<Ctx>(async (ctx) => {
		ctx.fastify = await build()
	})

	describe('findOneOrThrow', () => {
		test<Ctx>('should throw error if user not found', async ({ fastify }) => {
			const { UserQueriesRepo } = fastify.diContainer.cradle
			expect(
				UserQueriesRepo.findOneOrThrow({ where: { id: randomUUID() } }),
			).rejects.toThrow(UserNotFound)

			expect(
				UserQueriesRepo.findOneOrThrow({
					where: { email: 'mark@example.com' },
				}),
			).rejects.toThrow(UserNotFound)
		})

		test<Ctx>('should return the user if it exists', async ({ fastify }) => {
			const { UserMutationsRepo, UserQueriesRepo } = fastify.diContainer.cradle
			const params = createTestUser()
			const user = await UserMutationsRepo.create(params)
			expect(
				UserQueriesRepo.findOneOrThrow({ where: { id: user.id } }),
			).resolves.toMatchObject(params)
		})
	})

	describe('findOne queries', () => {
		test<Ctx>('should return null if user not found', async ({ fastify }) => {
			const { UserQueriesRepo } = fastify.diContainer.cradle
			expect(
				UserQueriesRepo.findOne({ where: { id: randomUUID() } }),
			).resolves.toBe(undefined)
			expect(
				UserQueriesRepo.findOne({ where: { email: 'mark@example.com' } }),
			).resolves.toBe(undefined)
			expect(
				UserQueriesRepo.findOne({ where: { username: 'mark' } }),
			).resolves.toBe(undefined)
		})

		test<Ctx>('should return the user if it exists', async ({ fastify }) => {
			const { UserMutationsRepo, UserQueriesRepo } = fastify.diContainer.cradle
			const params = createTestUser()
			const user = await UserMutationsRepo.create(params)
			expect(
				UserQueriesRepo.findOne({ where: { id: user.id } }),
			).resolves.toMatchObject(params)
			expect(
				UserQueriesRepo.findOne({ where: { email: user.email } }),
			).resolves.toMatchObject(params)
			expect(
				UserQueriesRepo.findOne({ where: { username: user.username } }),
			).resolves.toMatchObject(params)
		})
	})

	describe('create user', () => {
		test<Ctx>('should create a user', async ({ fastify }) => {
			const { UserMutationsRepo, UserQueriesRepo } = fastify.diContainer.cradle
			const params = createTestUser()
			const createdUser = await UserMutationsRepo.create(params)
			const user = await UserQueriesRepo.findOne({
				where: { id: createdUser.id },
			})
			expect(user).toMatchObject(params)
		})
	})

	describe('updateTakeOne', () => {
		test<Ctx>('should update a user', async ({ fastify }) => {
			const { UserMutationsRepo, UserQueriesRepo } = fastify.diContainer.cradle
			const params = createTestUser()
			const user = await UserMutationsRepo.create(params)
			const updatedUser = await UserMutationsRepo.updateTakeOne({
				where: { id: user.id },
				data: { username: 'new_username' },
			})
			expect(updatedUser!.username).toEqual('new_username')
			expect(
				UserQueriesRepo.findOne({ where: { id: user.id } }),
			).resolves.toEqual(updatedUser)
		})

		test<Ctx>('should return undefined if user not found', async ({
			fastify,
		}) => {
			const { UserMutationsRepo } = fastify.diContainer.cradle
			const updatedUser = await UserMutationsRepo.updateTakeOne({
				where: { id: randomUUID() },
				data: { username: 'new_username' },
			})
			expect(updatedUser).toBe(undefined)
		})
	})

	describe('updateTakeOneOrThrow', () => {
		test<Ctx>('should update a user', async ({ fastify }) => {
			const { UserMutationsRepo, UserQueriesRepo } = fastify.diContainer.cradle
			const params = createTestUser()
			const user = await UserMutationsRepo.create(params)
			const updatedUser = await UserMutationsRepo.updateTakeOneOrThrow({
				where: { id: user.id },
				data: { username: 'new_username' },
			})
			expect(updatedUser.username).toEqual('new_username')

			const result = await UserQueriesRepo.findOne({ where: { id: user.id } })
			expect(result).toMatchObject(updatedUser)
		})

		test<Ctx>('should throw error if user not found', async ({ fastify }) => {
			const { UserMutationsRepo } = fastify.diContainer.cradle
			expect(
				UserMutationsRepo.updateTakeOneOrThrow({
					where: { id: randomUUID() },
					data: { username: 'new_username' },
				}),
			).rejects.toThrow(UserNotFound)
		})
	})

	describe('findAccountStatus', () => {
		test<Ctx>('should return an error if user not found', async ({
			fastify,
		}) => {
			const { UserQueriesRepo } = fastify.diContainer.cradle
			expect(UserQueriesRepo.findAccountStatus(randomUUID())).rejects.toThrow(
				UserNotFound,
			)
		})

		test<Ctx>('should return the user with all its social accounts if it exists', async ({
			fastify,
		}) => {
			const { UserMutationsRepo, UserQueriesRepo, SocialAccountRepository } =
				fastify.diContainer.cradle
			const userParams = createTestUser()
			const user = await UserMutationsRepo.create(userParams)
			const googleSocial = createSocialAccount({ userId: user.id })
			const facebookSocial = createSocialAccount({
				userId: user.id,
				socialId: 'fb12354',
				provider: 'facebook',
			})

			const googleAccount = await SocialAccountRepository.create(googleSocial)
			const facebookAccount = await SocialAccountRepository.create(
				facebookSocial,
			)
			const socialAccounts = [googleAccount, facebookAccount].map(
				({ createdAt: _createdAt, updatedAt: _updatedAt, ...social }) => social,
			)

			const userWithSocial = await UserQueriesRepo.findAccountStatus(user.id)

			const formattedUserWithSocial = {
				...userWithSocial,
				socialAccounts: userWithSocial.socialAccounts.map(
					({ createdAt: _createdAT, updatedAt: _updatedAt, ...social }) =>
						social,
				),
			}

			expect(formattedUserWithSocial).toMatchObject({
				...user,
				socialAccounts,
			})
		})
	})
})

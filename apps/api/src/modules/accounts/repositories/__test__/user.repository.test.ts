import { build } from '@api/test/build'
import {
	createSocialAccount,
	createTestUser,
} from '@api/test/fixtures/accounts'
import { NotFound } from '@api/utils/errors/baseError'
import { randomUUID } from 'crypto'
import type { FastifyInstance } from 'fastify'
import { beforeEach, describe, expect, test } from 'vitest'

type Ctx = {
	fastify: FastifyInstance
}

describe('UserRepository', () => {
	beforeEach<Ctx>(async (ctx) => {
		ctx.fastify = await build()
	})

	describe('findOneOrThrow', () => {
		test<Ctx>('should throw error if user not found', async ({ fastify }) => {
			const { UserRepository } = fastify.diContainer.cradle
			expect(UserRepository.findByIdOrThrow(randomUUID())).rejects.toThrow(
				NotFound,
			)
		})

		test<Ctx>('should return the user if it exists', async ({ fastify }) => {
			const { UserRepository } = fastify.diContainer.cradle
			const params = createTestUser()
			const user = await UserRepository.create(params)
			expect(UserRepository.findByIdOrThrow(user.id)).resolves.toMatchObject(
				params,
			)
		})
	})

	describe('findOne queries', () => {
		test<Ctx>('should return null if user not found', async ({ fastify }) => {
			const { UserRepository } = fastify.diContainer.cradle
			expect(UserRepository.findById(randomUUID())).resolves.toBe(undefined)
			expect(UserRepository.findByEmail('mark@example.com')).resolves.toBe(
				undefined,
			)
		})

		test<Ctx>('should return the user if it exists', async ({ fastify }) => {
			const { UserRepository } = fastify.diContainer.cradle
			const params = createTestUser()
			const user = await UserRepository.create(params)
			expect(UserRepository.findById(user.id)).resolves.toMatchObject(params)
			expect(UserRepository.findByEmail(user.email)).resolves.toMatchObject(
				params,
			)
		})
	})

	describe('create user', () => {
		test<Ctx>('should create a user', async ({ fastify }) => {
			const { UserRepository } = fastify.diContainer.cradle
			const params = createTestUser()
			const createdUser = await UserRepository.create(params)
			const user = await UserRepository.findById(createdUser.id)
			expect(user).toMatchObject(params)
		})
	})

	describe('updateTakeOne', () => {
		test<Ctx>('should update a user', async ({ fastify }) => {
			const { UserRepository } = fastify.diContainer.cradle
			const params = createTestUser()
			const user = await UserRepository.create(params)
			const updatedUser = await UserRepository.updateTakeOne({
				where: { id: user.id },
				data: { username: 'new_username' },
			})
			expect(updatedUser!.username).toEqual('new_username')
			expect(UserRepository.findById(user.id)).resolves.toEqual(updatedUser)
		})

		test<Ctx>('should return undefined if user not found', async ({
			fastify,
		}) => {
			const { UserRepository } = fastify.diContainer.cradle
			const updatedUser = await UserRepository.updateTakeOne({
				where: { id: randomUUID() },
				data: { username: 'new_username' },
			})
			expect(updatedUser).toBe(undefined)
		})
	})

	describe('updateTakeOneOrThrow', () => {
		test<Ctx>('should update a user', async ({ fastify }) => {
			const { UserRepository } = fastify.diContainer.cradle
			const params = createTestUser()
			const user = await UserRepository.create(params)
			const updatedUser = await UserRepository.updateTakeOneOrThrow({
				where: { id: user.id },
				data: { username: 'new_username' },
			})
			expect(updatedUser.username).toEqual('new_username')

			const result = await UserRepository.findById(user.id)
			expect(result).toMatchObject(updatedUser)
		})

		test<Ctx>('should throw error if user not found', async ({ fastify }) => {
			const { UserRepository } = fastify.diContainer.cradle
			expect(
				UserRepository.updateTakeOneOrThrow({
					where: { id: randomUUID() },
					data: { username: 'new_username' },
				}),
			).rejects.toThrow(NotFound)
		})
	})

	describe('findAccountStatus', () => {
		test<Ctx>('should return an error if user not found', async ({
			fastify,
		}) => {
			const { UserRepository } = fastify.diContainer.cradle
			expect(UserRepository.findAccountStatus(randomUUID())).rejects.toThrow(
				NotFound,
			)
		})

		test<Ctx>('should return the user with all its social accounts if it exists', async ({
			fastify,
		}) => {
			const { UserRepository, SocialAccountRepository } =
				fastify.diContainer.cradle
			const userParams = createTestUser()
			const user = await UserRepository.create(userParams)
			const googleSocial = createSocialAccount({ userId: user.id })
			const discordSocial = createSocialAccount({
				userId: user.id,
				socialId: 'discord123',
				provider: 'discord',
			})

			const googleAccount = await SocialAccountRepository.create(googleSocial)
			const discordAccount = await SocialAccountRepository.create(discordSocial)
			const socialAccounts = [googleAccount, discordAccount].map(
				({ createdAt: _createdAt, updatedAt: _updatedAt, ...social }) => social,
			)

			const userWithSocial = await UserRepository.findAccountStatus(user.id)

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

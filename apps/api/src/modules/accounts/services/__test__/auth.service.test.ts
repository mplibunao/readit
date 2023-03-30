import { Session } from '@api/infra/session'
import { build } from '@api/test/build'
import {
	createMockPubSubClient,
	MockPubSubClient,
} from '@api/test/mocks/pubsub'
import { createMockSession } from '@api/test/mocks/session'
import { NotFound } from '@api/utils/errors/baseError'
import { asValue } from 'awilix'
import { randomUUID } from 'crypto'
import type { FastifyInstance } from 'fastify'
import { describe, beforeEach, test, expect } from 'vitest'

import { InvalidToken, TokenNotFound } from '../../domain/token.errors'
import { UserAlreadyConfirmed } from '../../domain/user.errors'
import { UserSchemas } from '../../domain/user.schema'

type Context = {
	fastify: FastifyInstance
	session: Session
	mockedPubsub: MockPubSubClient
	user: UserSchemas.CreateUserInput
	createdUser: UserSchemas.User
}

describe('AuthService', () => {
	beforeEach<Context>(async (ctx) => {
		const session = createMockSession()
		const mockedPubsub = createMockPubSubClient()
		const fastify = await build({
			dependencyOverrides: {
				pubsub: asValue(mockedPubsub),
			},
		})

		ctx.fastify = fastify
		ctx.session = session
		ctx.mockedPubsub = mockedPubsub
		ctx.user = {
			email: 'john@example.com',
			firstName: 'John',
			lastName: 'Doe',
			password: 'Password1!',
			username: 'john',
		}
	})

	describe('register', () => {
		beforeEach<Context>(async (ctx) => {
			const { fastify, session, user } = ctx
			const { AuthService } = fastify.diContainer.cradle
			ctx.createdUser = await AuthService.register({ input: user, session })
		})

		test<Context>('should return an error if user with email exists', async ({
			fastify,
			user,
			session,
		}) => {
			const { AuthService } = fastify.diContainer.cradle
			const result = AuthService.register({
				input: { ...user, username: 'jane' },
				session,
			})
			expect(result).rejects.toThrow()
		})

		test<Context>('should create a user', async ({ fastify, createdUser }) => {
			const { UserService } = fastify.diContainer.cradle
			const u = await UserService.findById(createdUser.id)
			expect(u).toMatchObject(createdUser)
		})

		test<Context>('should publish a user created event upon creating a user', async ({
			mockedPubsub,
		}) => {
			expect(mockedPubsub.publishMessage).toHaveBeenCalledTimes(1)
		})

		test<Context>('should log the user in upon creating the user', async ({
			session,
			createdUser,
		}) => {
			expect(session.user).toMatchObject({ id: createdUser.id })
		})
	})

	describe('verifyLoginToken', () => {
		beforeEach<Context>(async (ctx) => {
			const { user, fastify, session } = ctx
			const { AuthService } = fastify.diContainer.cradle
			ctx.createdUser = await AuthService.register({ input: user, session })
		})

		test<Context>('should return an error if the token type is invalid', async ({
			fastify,
			createdUser,
			session,
		}) => {
			const { AuthService, TokenService } = fastify.diContainer.cradle
			const token = await TokenService.create({
				type: 'accountActivation',
				userId: createdUser.id,
				expirationTimeInSeconds: 60,
			})
			const result = AuthService.verifyLoginToken({ id: token.id, session })
			expect(result).rejects.toThrow(InvalidToken)
		})

		test<Context>('should return an error if token does not exist', async ({
			fastify,
			session,
		}) => {
			const { AuthService } = fastify.diContainer.cradle
			const result = AuthService.verifyLoginToken({ id: randomUUID(), session })
			expect(result).rejects.toThrow(TokenNotFound)
		})

		test<Context>('should log user in after verfying token', async ({
			fastify,
			createdUser,
			session,
		}) => {
			const { AuthService, TokenService } = fastify.diContainer.cradle
			// Reset session since register logs the user in
			session = createMockSession()
			const token = await TokenService.create({
				type: 'login',
				userId: createdUser.id,
				expirationTimeInSeconds: 60,
			})
			expect(session.user).toBeUndefined()
			await AuthService.verifyLoginToken({ id: token.id, session })
			expect(session.user).toMatchObject({ id: createdUser.id })
		})

		test<Context>('should delete token after verfying token', async ({
			fastify,
			createdUser,
			session,
		}) => {
			const { AuthService, TokenService } = fastify.diContainer.cradle
			const token = await TokenService.create({
				type: 'login',
				userId: createdUser.id,
				expirationTimeInSeconds: 60,
			})
			await AuthService.verifyLoginToken({ id: token.id, session })
			expect(
				AuthService.verifyLoginToken({ id: token.id, session }),
			).rejects.toThrow(TokenNotFound)
		})
	})

	describe('confirmEmail', () => {
		beforeEach<Context>(async (ctx) => {
			const { fastify, user, session } = ctx
			const { AuthService } = fastify.diContainer.cradle
			ctx.createdUser = await AuthService.register({ input: user, session })
		})

		test<Context>('should return an error if token type is invalid', async ({
			fastify,
			createdUser,
		}) => {
			const { TokenService, AuthService } = fastify.diContainer.cradle
			const token = await TokenService.create({
				userId: createdUser.id,
				type: 'login',
				expirationTimeInSeconds: 60,
			})
			expect(AuthService.confirmEmail(token.id)).rejects.toThrow(InvalidToken)
		})

		test<Context>('should return an error if token does not exist', async ({
			fastify,
		}) => {
			const { AuthService } = fastify.diContainer.cradle
			const result = AuthService.confirmEmail(randomUUID())
			expect(result).rejects.toThrow(TokenNotFound)
		})

		test<Context>('should throw an error if user in token does not exist', async ({
			fastify,
		}) => {
			const { TokenService, AuthService } = fastify.diContainer.cradle
			const token = await TokenService.create({
				userId: randomUUID(),
				type: 'accountActivation',
				expirationTimeInSeconds: 60,
			})
			expect(AuthService.confirmEmail(token.id)).rejects.toThrow(NotFound)
		})

		test<Context>('should throw an error if user in token is already confirmed', async ({
			fastify,
		}) => {
			const { TokenService, AuthService, UserRepository } =
				fastify.diContainer.cradle
			const confirmedUser = {
				id: randomUUID(),
				email: 'johnny@example.com',
				firstName: 'John',
				lastName: 'Doe',
				username: 'johnny',
				confirmedAt: 'Now()',
			}
			await UserRepository.create(confirmedUser)
			const token = await TokenService.create({
				userId: confirmedUser.id,
				type: 'accountActivation',
				expirationTimeInSeconds: 60,
			})
			try {
				await AuthService.confirmEmail(token.id)
			} catch (error) {
				expect(error).toBeInstanceOf(UserAlreadyConfirmed)
			}
		})

		test<Context>('should delete token after confirming email', async ({
			fastify,
			createdUser,
		}) => {
			const { TokenService, AuthService } = fastify.diContainer.cradle
			const token = await TokenService.create({
				userId: createdUser.id,
				type: 'accountActivation',
				expirationTimeInSeconds: 60,
			})
			await AuthService.confirmEmail(token.id)
			expect(AuthService.confirmEmail(token.id)).rejects.toThrow(TokenNotFound)
		})

		test<Context>('should confirm user after confirming email', async ({
			fastify,
			createdUser,
		}) => {
			const { TokenService, AuthService, UserService } =
				fastify.diContainer.cradle
			const token = await TokenService.create({
				userId: createdUser.id,
				type: 'accountActivation',
				expirationTimeInSeconds: 60,
			})
			await AuthService.confirmEmail(token.id)
			const confirmedUser = await UserService.findById(createdUser.id)
			expect(confirmedUser?.confirmedAt).not.toBeUndefined()
		})
	})
})

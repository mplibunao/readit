import { Session } from '@api/infra/session'
import { build } from '@api/test/build'
import {
	createMockPubSubClient,
	MockPubSubClient,
} from '@api/test/mocks/pubsub'
import { createMockSession } from '@api/test/mocks/session'
import { asValue } from 'awilix'
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { beforeEach, describe, expect, it } from 'vitest'

import { UserSchemas } from '../../domain/user.schema'

type Context = {
	fastify: FastifyInstance
	session: Session
	mockedPubsub: MockPubSubClient
	user: UserSchemas.User
	tags: Array<{ id: string; name: string }>
}

describe('UserService', () => {
	beforeEach<Context>(async (context) => {
		const session = createMockSession()
		const mockedPubsub = createMockPubSubClient()
		const fastify = await build({
			dependencyOverrides: {
				pubsub: asValue(mockedPubsub),
			},
		})

		context.session = session
		context.mockedPubsub = mockedPubsub
		context.fastify = fastify
	})

	describe('upsertUserInterests', () => {
		beforeEach<Context>(async (context) => {
			const { TagService, AuthService } = context.fastify.diContainer.cradle
			context.tags = [
				{ id: randomUUID(), name: 'reactjs' },
				{ id: randomUUID(), name: 'nodejs' },
			]
			await TagService.createTags(context.tags)
			context.user = await AuthService.register({
				input: {
					email: 'johnny@example.com',
					firstName: 'John',
					lastName: 'Doe',
					password: 'Password1!',
					username: 'john',
				},
				session: context.session,
			})
		})

		it<Context>('should create one or more user interests', async ({
			fastify,
			tags,
			session,
			user,
		}) => {
			const { UserService } = fastify.diContainer.cradle
			await UserService.upsertUserInterests(
				{ tagIds: tags.map((tag) => tag.id) },
				session!.user!.id,
			)

			const interests = await UserService.getUserInterests(user.id)
			expect(interests).toHaveLength(tags.length)
		})

		it<Context>('should add user interests when additional tagIds are added into the array of tagIds', async ({
			fastify,
			tags,
			session,
		}) => {
			const { UserService, TagService } = fastify.diContainer.cradle

			const tag = { id: randomUUID(), name: 'typescript' }
			await TagService.createTags([tag])
			await UserService.upsertUserInterests(
				{ tagIds: [tag.id] },
				session!.user!.id,
			)
			const interests = await UserService.getUserInterests(session!.user!.id)
			expect(interests).toHaveLength(1)

			await UserService.upsertUserInterests(
				{ tagIds: tags.map((tag) => tag.id).concat(tag.id) },
				session!.user!.id,
			)

			const updatedInterests = await UserService.getUserInterests(
				session!.user!.id,
			)
			expect(updatedInterests).toHaveLength(tags.length + 1)
		})

		it<Context>('should remove user interests when tagIds are removed from the array of tagIds', async ({
			fastify,
			tags,
			session,
		}) => {
			const { UserService } = fastify.diContainer.cradle

			await UserService.upsertUserInterests(
				{ tagIds: tags.map((tag) => tag.id) },
				session!.user!.id,
			)
			const interests = await UserService.getUserInterests(session!.user!.id)
			expect(interests).toHaveLength(tags.length)

			await UserService.upsertUserInterests(
				{ tagIds: [tags[0]!.id] },
				session!.user!.id,
			)

			const updatedInterests = await UserService.getUserInterests(
				session!.user!.id,
			)
			expect(updatedInterests).toHaveLength(1)
			expect(updatedInterests[0]!.tagId).toBe(tags[0]!.id)
		})
	})
})

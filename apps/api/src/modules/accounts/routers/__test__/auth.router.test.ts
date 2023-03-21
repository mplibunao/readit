import { build } from '@api/test/build'
import { createMockPubSubClient } from '@api/test/mocks/pubsub'
import { createMockSession } from '@api/test/mocks/session'
import { AppRouter, appRouter, createContextInner } from '@api/trpc'
import { inferProcedureInput } from '@trpc/server'
import { asValue } from 'awilix'
import { describe, expect, test } from 'vitest'

describe('TRPC auth router', () => {
	test('auth.register should create a user and fetch the same user using user.byId', async () => {
		const mockedSession = createMockSession()
		const mockedPubSubClient = createMockPubSubClient()
		const fastify = await build({
			dependencyOverrides: {
				pubsub: asValue(mockedPubSubClient),
			},
		})

		const ctx = await createContextInner({
			deps: fastify.diContainer.cradle,
			session: mockedSession,
		})
		const caller = appRouter.createCaller(ctx)
		const input: inferProcedureInput<AppRouter['auth']['register']> = {
			email: 'john@example.com',
			firstName: 'John',
			lastName: 'Doe',
			password: 'Password1!',
			username: 'mplibunao',
		}

		const user = await caller.auth.register(input)
		expect(user).toMatchObject({
			email: input.email,
			firstName: input.firstName,
			lastName: input.lastName,
		})

		expect(mockedPubSubClient.publishMessage).toHaveBeenCalledTimes(1)

		const userById = await caller.user.byId({ id: user.id })

		expect(userById).toMatchObject({
			email: input.email,
			firstName: input.firstName,
			lastName: input.lastName,
		})
	})
})

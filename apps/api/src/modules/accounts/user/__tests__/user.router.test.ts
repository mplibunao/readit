import { build } from '@api/helpers/test/build'
import { AppRouter, appRouter, createContextInner } from '@api/trpc'
import { inferProcedureInput } from '@trpc/server'
import { describe, expect, test } from 'vitest'

describe('TRPC user router', () => {
	test('user.register should create a user and fetch the same user using user.byId', async () => {
		const fastify = await build()
		const ctx = await createContextInner({ deps: fastify.diContainer.cradle })
		const caller = appRouter.createCaller(ctx)
		const input: inferProcedureInput<AppRouter['user']['register']> = {
			email: 'john@example.com',
			firstName: 'John',
			lastName: 'Doe',
			password: 'Password1!',
		}

		const user = await caller.user.register(input)
		expect(user).toMatchObject({
			email: input.email,
			firstName: input.firstName,
			lastName: input.lastName,
		})

		const userById = await caller.user.byId({ id: user.id })

		expect(userById).toMatchObject({
			email: input.email,
			firstName: input.firstName,
			lastName: input.lastName,
		})
	})
})

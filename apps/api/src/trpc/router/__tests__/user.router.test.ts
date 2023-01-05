import { build } from '@api/helpers/test/build'
import { clearDatabase } from '@api/helpers/test/clearDatabase'
import { pg } from '@api/infra/pg/client'
import { createContextInner } from '@api/trpc'
import { inferProcedureInput } from '@trpc/server'
import { beforeEach, describe, expect, test } from 'vitest'

import { AppRouter, appRouter } from '..'

beforeEach(async () => {
	await clearDatabase()
})

describe('TRPC user router', () => {
	test('user.register should create a user and fetch the same user using user.byId', async () => {
		await build()
		const ctx = await createContextInner({ pg: pg })
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

		const userById = await caller.user.byId({ id: user.id as string })

		expect(userById).toMatchObject({
			email: input.email,
			firstName: input.firstName,
			lastName: input.lastName,
		})
	})
})

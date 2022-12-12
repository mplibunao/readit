import { clearDatabase } from '@/helpers/test/clearDatabase'
import { db } from '@/infra/pg/client'
import { createContextInner } from '@/trpc/context'
import { inferProcedureInput } from '@trpc/server'
import { test, describe, beforeEach, expect } from 'vitest'
import { appRouter, Router } from '..'

beforeEach(async () => {
	await clearDatabase()
})

describe('TRPC user router', () => {
	test('user.register should create a user and fetch the same user using user.byId', async () => {
		const ctx = await createContextInner({ pg: db })
		const caller = appRouter.createCaller(ctx)

		const input: inferProcedureInput<Router['user']['register']> = {
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

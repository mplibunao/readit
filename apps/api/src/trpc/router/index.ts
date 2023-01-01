import { DatabaseError } from '@api/helpers/errors'

import { publicProcedure, t } from '../trpc'
import { userRouter } from './user.router'

export const uptimeRouter = t.router({
	uptime: publicProcedure.query(() => {
		throw new DatabaseError(new Error('SUP'))
		return {
			uptime: process.uptime(),
		}
	}),
})

export type AppRouter = typeof appRouter

export const appRouter = t.router({
	user: userRouter,
	uptime: uptimeRouter,
})

//export type AppRouter = typeof appRouter

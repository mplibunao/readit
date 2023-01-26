import { userRouter } from '@api/modules/accounts/routers/user.router'

import { publicProcedure, t } from './builder'

export const uptimeRouter = t.router({
	uptime: publicProcedure.query(() => {
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

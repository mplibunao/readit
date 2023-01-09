import { userRouter } from '@api/modules/accounts/user/user.router'

import { publicProcedure, t } from './trpc'

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

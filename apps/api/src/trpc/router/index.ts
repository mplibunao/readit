import { publicProcedure, router } from '../trpc'
import { userRouter } from './user.router'

export const uptimeRouter = router({
	uptime: publicProcedure.query(() => {
		return {
			uptime: process.uptime(),
		}
	}),
})

export const appRouter = router({
	user: userRouter,
	uptime: uptimeRouter,
})

export type Router = typeof appRouter

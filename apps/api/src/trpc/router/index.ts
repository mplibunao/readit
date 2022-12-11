import { t } from '../builder'

export const appRouter = t.router({
	uptime: t.procedure.query(() => {
		return {
			uptime: process.uptime(),
		}
	}),
})

export type Router = typeof appRouter

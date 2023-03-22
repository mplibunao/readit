import { authRouter } from '@api/modules/accounts/routers/auth.router'
import { userRouter } from '@api/modules/accounts/routers/user.router'
import { communityRouter } from '@api/modules/communities/routers/community.router'
import { tagRouter } from '@api/modules/recommendations/router/tag.router'

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
	auth: authRouter,
	uptime: uptimeRouter,
	community: communityRouter,
	tag: tagRouter,
})

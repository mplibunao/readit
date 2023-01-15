import type { AppRouter } from '@readit/api'
import { createTRPCNext } from '@trpc/next'

import { config } from './config'

export const client = createTRPCNext<AppRouter>({
	config() {
		return config
	},
	ssr: true,
})

import type { AppRouter } from '@readit/api'
import {
	CreateTRPCClientOptions,
	httpBatchLink,
	httpLink,
	loggerLink,
	splitLink,
} from '@trpc/client'
import superjson from 'superjson'

import { trpcUrl } from '../url'

export const config: CreateTRPCClientOptions<AppRouter> = {
	links: [
		loggerLink({
			enabled: (opts) =>
				process.env.NODE_ENV === 'development' ||
				(opts.direction === 'down' && opts.result instanceof Error),
		}),
		splitLink({
			condition(op) {
				return op.context.skipBatch === true
			},
			true: httpLink({
				url: trpcUrl,
			}),
			false: httpBatchLink({
				url: trpcUrl,
				maxURLLength: 2083,
			}),
		}),
	],
	transformer: superjson,
}
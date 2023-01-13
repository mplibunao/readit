import 'server-only'

import { trpcUrl } from '@/utils/url'
import type { AppRouter } from '@readit/api'
import { createTRPCProxyClient, httpBatchLink, loggerLink } from '@trpc/client'
import superjson from 'superjson'

const links = [
	loggerLink({
		enabled: (opts) =>
			process.env.NODE_ENV === 'development' ||
			(opts.direction === 'down' && opts.result instanceof Error),
	}),
	httpBatchLink({
		url: trpcUrl,
		fetch(url, opts) {
			return fetch(url, { ...opts, credentials: 'include' })
		},
	}),
]

export const rscTrpc = createTRPCProxyClient<AppRouter>({
	transformer: superjson,
	links,
})

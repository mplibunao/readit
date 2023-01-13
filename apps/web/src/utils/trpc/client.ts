import { trpcUrl } from '@/utils/url'
import type { AppRouter } from '@readit/api'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCReact } from '@trpc/react-query'
import superjson from 'superjson'

export const trpc = createTRPCReact<AppRouter>()

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

export const clientTrpc = trpc.createClient({
	links,
	transformer: superjson,
})

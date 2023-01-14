import { trpcUrl } from '@/utils/url'
import type { AppRouter } from '@readit/api'
import { httpBatchLink, httpLink, loggerLink, splitLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import type { inferReactQueryProcedureOptions } from '@trpc/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'

const links = [
	loggerLink({
		enabled: (opts) =>
			process.env.NODE_ENV === 'development' ||
			(opts.direction === 'down' && opts.result instanceof Error),
	}),
	splitLink({
		condition(op) {
			return op.context.skipBatch === true
		},
		true: httpLink({ url: trpcUrl }),
		false: httpBatchLink({
			url: trpcUrl,
			fetch(url, opts) {
				return fetch(url, { ...opts, credentials: 'include' })
			},
		}),
	}),
]

export const trpc = createTRPCNext<AppRouter>({
	config() {
		return {
			transformer: superjson,
			links,
		}
	},
	ssr: true,
})

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>

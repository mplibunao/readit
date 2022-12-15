import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'
import { isServer } from './ssr'
import type { AppRouter } from 'api'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import type { inferReactQueryProcedureOptions } from '@trpc/react-query'
import { env } from '@/env/server.mjs'
import { env as clientEnv } from '@/env/client.mjs'

export function getBaseUrl() {
	if (!isServer()) return env.API_URL // csr should use relative path
	return clientEnv.NEXT_PUBLIC_API_URL
}

const url = `${getBaseUrl()}`
const links = [
	loggerLink({
		enabled: (opts) =>
			process.env.NODE_ENV === 'development' ||
			(opts.direction === 'down' && opts.result instanceof Error),
	}),
	httpBatchLink({ url }),
]

export const trpc = createTRPCNext<AppRouter>({
	config() {
		return {
			transformer: superjson,
			links,
			url,
		}
	},
	ssr: false,
})

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>

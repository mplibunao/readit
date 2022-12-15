//import { createTRPCReact } from '@trpc/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import superjson from 'superjson'
//import type { GetInferenceHelpers } from '@trpc/server'
import { isServer } from './ssr'
//import { AppRouter } from 'api/src/trpc'
//import type { ApiRouter as AppRouter } from 'api'
import type { AppRouter } from 'api'
//import { createTRPCReact, httpBatchLink, loggerLink } from '@trpc/react-query'
//import type { AppRouter as ApiRouter } from 'api/src/trpc/router'

export function getBaseUrl() {
	if (!isServer()) return process.env.NEXT_PUBLIC_API_URL // csr should use relative path
	return process.env.API_URL
	//return `https://${process.env.API_URL}` // ssr on vercel should use vercel url
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

//export const trpc = createTRPCReact<AppRouter>()

//export const initTrpcClient = () =>
//trpc.createClient({
//links,
//transformer: superjson,
//})

//export type AppRouterTypes = GetInferenceHelpers<AppRouter>

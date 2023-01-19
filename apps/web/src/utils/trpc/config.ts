import type { AppRouter } from '@readit/api'
import {
	CreateTRPCClientOptions,
	httpBatchLink,
	httpLink,
	loggerLink,
	splitLink,
} from '@trpc/client'
import { log } from 'next-axiom'
import superjson from 'superjson'

import { isServer } from '../ssr'

//import { getApiBaseUrl } from '../url'

const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL
log.info('baseUrl!', { baseUrl, isServer: Boolean(isServer()) })

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
				//url: `${getApiBaseUrl()}/trpc`,
				url: `${baseUrl}/trpc`,
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: 'include',
						mode: 'cors',
					})
				},
			}),
			false: httpBatchLink({
				//url: `${getApiBaseUrl()}/trpc`,
				url: `${baseUrl}/trpc`,
				maxURLLength: 2083,
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: 'include',
						mode: 'cors',
					})
				},
			}),
		}),
	],
	transformer: superjson,
}

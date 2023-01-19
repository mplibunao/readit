import type { AppRouter } from '@readit/api'
import {
	CreateTRPCClientOptions,
	httpBatchLink,
	httpLink,
	loggerLink,
	splitLink,
} from '@trpc/client'
import superjson from 'superjson'

import { getApiBaseUrl } from '../url'

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
				url: `${getApiBaseUrl()}/trpc`,
				fetch(url, options) {
					return fetch(url, {
						...options,
						credentials: 'include',
						mode: 'cors',
					})
				},
			}),
			false: httpBatchLink({
				url: `${getApiBaseUrl()}/trpc`,
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

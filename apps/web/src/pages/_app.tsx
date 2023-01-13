import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { apiFetch } from '@/utils/request'
import { trpc } from '@/utils/trpc'
import { trpcUrl } from '@/utils/url'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/client'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import superjson from 'superjson'

console.log('trpcUrl.toString()', trpcUrl) // eslint-disable-line no-console
const links = [
	loggerLink({
		enabled: (opts) =>
			process.env.NODE_ENV === 'development' ||
			(opts.direction === 'down' && opts.result instanceof Error),
	}),
	httpBatchLink({
		url: 'http://localhost:4000/trpc',
		//fetch(url, opts) {
		//return apiFetch(url, opts)
		//},
	}),
]

function MyApp({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links,
			transformer: superjson,
		}),
	)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<main>
					<Component {...pageProps} />
				</main>
			</QueryClientProvider>
		</trpc.Provider>
	)
}

export default MyApp

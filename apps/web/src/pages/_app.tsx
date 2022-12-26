import '../styles/global.css'
import type { AppProps } from 'next/app'
import { Inter } from '@next/font/google'
import { trpc } from '@/utils/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { httpBatchLink, loggerLink } from '@trpc/client'
import superjson from 'superjson'
import { trpcUrl } from '@/utils/url'

const interVariable = Inter({
	subsets: ['latin'],
	variable: '--font-inter',
})

const links = [
	loggerLink({
		enabled: (opts) =>
			process.env.NODE_ENV === 'development' ||
			(opts.direction === 'down' && opts.result instanceof Error),
	}),
	httpBatchLink({ url: trpcUrl }),
]

function MyApp({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links,
			transformer: superjson,
		})
	)

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<main className={`${interVariable.className} font-sans`}>
					<Component {...pageProps} />
				</main>
			</QueryClientProvider>
		</trpc.Provider>
	)
}

export default MyApp

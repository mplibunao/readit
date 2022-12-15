import '../styles/global.css'
import type { AppProps } from 'next/app'
import { Inter } from '@next/font/google'
import { useMemo } from 'react'
import { initTrpcClient, trpc } from '@/utils/trpc'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const interVariable = Inter({
	variable: '--font-inter',
})

function MyApp({ Component, pageProps }: AppProps) {
	const trpcClient = useMemo(initTrpcClient, [])
	const queryClient = useMemo(() => new QueryClient(), [])

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
//export default trpc.withTRPC(MyApp)

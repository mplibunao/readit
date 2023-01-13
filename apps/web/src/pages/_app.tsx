import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { trpc } from '@/utils/trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			<main>
				<Component {...pageProps} />
			</main>
		</QueryClientProvider>
	)
}

export default trpc.withTRPC(MyApp)

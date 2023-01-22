import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { TrpcClientProvider } from '@/utils/trpc/ClientProvider'
import { Provider as JotaiProvider } from 'jotai'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

const Providers = composeProviders([JotaiProvider], [TrpcClientProvider])

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<Providers>
			<main>
				<Component {...pageProps} />
				<Toaster position='top-right' />
			</main>
		</Providers>
	)
}

export { reportWebVitals } from 'next-axiom/dist/webVitals'

export default MyApp

// eslint-disable-next-line
function composeProviders(...providers: any[]) {
	return ({ children }: { children: React.ReactNode }) =>
		providers.reduceRight((acc, provider) => {
			const [Provider, props] = provider
			return <Provider {...props}>{acc}</Provider>
		}, children)
}

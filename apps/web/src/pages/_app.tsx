import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { ErrorFallback } from '@/components/Layout/Error'
import { TrpcClientProvider } from '@/utils/trpc/ClientProvider'
import { Provider as JotaiProvider } from 'jotai'
import { log } from 'next-axiom'
import type { AppProps } from 'next/app'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'react-hot-toast'

// Log errors to relevant services here
const HandleBoundaryError = (
	error: Error,
	info: { componentStack: string },
) => {
	log.error('ErrorBoundary caught error: ', { error, info })
}

const Providers = composeProviders([JotaiProvider], [TrpcClientProvider])

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			onError={HandleBoundaryError}
		>
			<Providers>
				<main className='h-full'>
					<Component {...pageProps} />
					<Toaster position='top-right' />
				</main>
			</Providers>
		</ErrorBoundary>
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

import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { Banners } from '@/components/Banner'
import { ErrorBoundaryFallback } from '@/components/Error'
import { ScrollToTop } from '@/components/ScrollToTop'
import { OnboardingRoot } from '@/features/accounts/onboarding'
import { LazyMotionFeatures } from '@/utils/framerMotion/LazyMotionFeatures'
import { TrpcClientProvider } from '@/utils/trpc/ClientProvider'
import { Provider as JotaiProvider } from 'jotai'
import { NextPage } from 'next'
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

const Providers = composeProviders([TrpcClientProvider, JotaiProvider])

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
	P,
	IP
> & {
	getLayout?: (page: React.ReactElement) => React.ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	const getLayout = Component.getLayout || ((page) => page)
	return (
		<ErrorBoundary
			FallbackComponent={ErrorBoundaryFallback}
			onError={HandleBoundaryError}
		>
			<Providers>
				<Banners />
				<main className='h-full'>
					{getLayout(<Component {...pageProps} />)}
				</main>
				<Toaster position='top-right' />
				<OnboardingRoot />
				<LazyMotionFeatures>
					<ScrollToTop />
				</LazyMotionFeatures>
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

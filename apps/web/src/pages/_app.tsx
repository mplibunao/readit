import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { ClientProvider } from '@/utils/trpc/ClientProvider'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main>
			<ClientProvider>
				<Component {...pageProps} />
			</ClientProvider>
		</main>
	)
}

export { reportWebVitals } from 'next-axiom/dist/webVitals'

export default MyApp

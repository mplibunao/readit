import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { client } from '@/utils/trpc/client'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main>
			<Component {...pageProps} />
		</main>
	)
}

export default client.withTRPC(MyApp)

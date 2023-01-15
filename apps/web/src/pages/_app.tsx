import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { trpc } from '@/utils/trpc'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main>
			<Component {...pageProps} />
		</main>
	)
}

export default trpc.withTRPC(MyApp)

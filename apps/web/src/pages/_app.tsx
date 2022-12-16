import '../styles/global.css'
import type { AppProps } from 'next/app'
import { Inter } from '@next/font/google'
import { trpc } from '@/utils/trpc'

const interVariable = Inter({
	variable: '--font-inter',
})

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<main className={`${interVariable.className} font-sans`}>
			<Component {...pageProps} />
		</main>
	)
}

//export default MyApp
export default trpc.withTRPC(MyApp)

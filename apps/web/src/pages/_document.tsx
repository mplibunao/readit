import { Favicon } from '@/components/Head/Favicon'
import { SEO } from '@/components/Head/SEO'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang='en'>
			<Head>
				<SEO />
				<Favicon />
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='black-translucent'
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}

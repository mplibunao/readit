import { Head, Html, Main, NextScript } from 'next/document'

import { Favicon } from '@/components/Favicon'
import { SEO } from '@/components/SEO'

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

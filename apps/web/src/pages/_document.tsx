import { Favicon, SEO } from '@/components/Head'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang='en' className='h-full'>
			<Head>
				<SEO />
				<Favicon />
				<meta
					name='apple-mobile-web-app-status-bar-style'
					content='black-translucent'
				/>
			</Head>
			<body className='h-full'>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}

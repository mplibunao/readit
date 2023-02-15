import { Favicon } from '@/components/Head/Favicon'
import { SEO } from '@/components/Head/SEO'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang='en' className='h-full bg-neutral-100'>
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

import '../styles/global.css'
import '@fontsource/inter/variable.css'

import Favicon from '@/components/Favicon'
import { SEO } from '@/components/SEO'

export default function Head() {
	return (
		<>
			<SEO />
			<Favicon />
			<meta
				name='apple-mobile-web-app-status-bar-style'
				content='black-translucent'
			/>
		</>
	)
}

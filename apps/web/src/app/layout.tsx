import '../styles/global.css'
import '@fontsource/inter/variable.css'

import { ClientProvider } from '@/components/ClientProvider'

export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<ClientProvider>
					<div>{props.children}</div>
				</ClientProvider>
			</body>
		</html>
	)
}

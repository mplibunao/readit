export const Favicon = (): JSX.Element => {
	return (
		<>
			<link
				rel='apple-touch-icon'
				sizes='180x180'
				href='/favicon/apple-touch-icon.png'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='32x32'
				href='/favicon/favicon-32x32.png'
			/>
			<link
				rel='icon'
				type='image/png'
				sizes='16x16'
				href='/favicon/favicon-16x16.png'
			/>
			<link rel='manifest' href='/favicon/site.webmanifest' />
			<link
				rel='mask-icon'
				href='/favicon/safari-pinned-tab.svg'
				color='#4f46e5'
			/>
			<link rel='shortcut icon' href='/favicon/favicon.ico' />
			<meta name='apple-mobile-web-app-title' content='Readit' />
			<meta name='application-name' content='Readit' />
			<meta name='msapplication-TileColor' content='#ffffff' />
			<meta name='msapplication-config' content='/favicon/browserconfig.xml' />
			<meta name='theme-color' content='#ffffff' />
		</>
	)
}

export default Favicon

/** @type {import('vite').UserConfig} */
const viteConfig = {
	// gives access to public folder
	publicDir: 'public',
	define: {
		'process.env': process.env,
	},
}

export default viteConfig

import path from 'path'

/** @type {import('vite').UserConfig} */
const viteConfig = {
	// gives access to public folder
	publicDir: 'public',
	define: {
		'process.env': process.env,
	},
	resolve: {
		alias: {
			'next/image': path.resolve(__dirname, './.ladle/UnoptimizedImage.tsx'),
			'next/router': path.resolve(__dirname, './.ladle/mockUseRouter.ts'),
		},
	},
}

export default viteConfig

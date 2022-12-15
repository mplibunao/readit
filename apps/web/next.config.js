/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	experimental: {
		transpilePackages: ['api'],
	},
}

// analyze
const shouldAnalyzeBundle = process.env.ANALYZE === 'true'
const withBundleAnalyzer = shouldAnalyzeBundle
	? require('@next/bundle-analyzer')({
			enabled: true,
	  })
	: (config) => config
if (shouldAnalyzeBundle) console.log('hello')

module.exports = () => {
	const plugins = [withBundleAnalyzer]

	return plugins.reduce((acc, next) => next(acc), nextConfig)
}

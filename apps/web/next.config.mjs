// @ts-check
import fs from 'fs'
import { withAxiom } from 'next-axiom'

import { env } from './src/env/server.mjs'

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
	return config
}

function getTranspilePackages() {
	const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

	//const included = new Set([])
	const transpilePackages = [...Object.keys(packageJson.dependencies)]
		//.filter((deps) => included.has(deps))
		.filter((deps) => deps.startsWith('@readit/'))
	return transpilePackages
}

getTranspilePackages()
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	// Next.js i18n docs: https://nextjs.org/docs/advanced-features/i18n-routing
	i18n: {
		locales: ['en'],
		defaultLocale: 'en',
	},
	experimental: {
		scrollRestoration: true,
		legacyBrowsers: false,
		transpilePackages: getTranspilePackages(),
		swcPlugins: [
			// Allow Date/Map in getStaticProps
			['next-superjson-plugin', {}],
		],
	},
	productionBrowserSourceMaps: process.env.VERCEL_ENV !== 'production',
	/** We already do linting and typechecking as separate tasks in CI */
	eslint: { ignoreDuringBuilds: !!process.env.CI },
	typescript: { ignoreBuildErrors: !!process.env.CI },
}

async function withBundleAnalyzer() {
	const shouldAnalyzeBundle = env.ANALYZE
	if (shouldAnalyzeBundle) {
		const { default: bundleAnalyzer } = await import('@next/bundle-analyzer')
		return bundleAnalyzer({
			enabled: true,
		})
	}

	return defineNextConfig
}

export default async function withPlugins() {
	const plugins = [await withBundleAnalyzer(), withAxiom]

	return plugins.reduce((acc, next) => next(acc), nextConfig)
}

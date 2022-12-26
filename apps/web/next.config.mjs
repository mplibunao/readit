// @ts-check
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
		transpilePackages: ['api', 'edge-config'],
	},
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
	const plugins = [await withBundleAnalyzer()]

	return plugins.reduce((acc, next) => next(acc), nextConfig)
}

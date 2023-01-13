import { isServer } from './ssr'

function getNextUrl() {
	if (!isServer()) return '' // csr should be relative anyway
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

	return `http://localhost:${process.env.PORT ?? 3000}`
}

export const nextBaseUrl = getNextUrl()

export function getApiBaseUrl() {
	if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
	if (process.env.API_URL) return process.env.API_URL

	return 'http://localhost:4000/api'
}

export const trpcUrl = `${getApiBaseUrl()}/trpc`

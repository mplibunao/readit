import { isServer } from './ssr'

function getNextUrl() {
	if (!isServer()) return location.href // relative for csr. Use with new URL()
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

	return `http://localhost:${process.env.PORT ?? 3000}`
}

export const nextBaseUrl = getNextUrl()

const apiBaseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

export const trpcUrl = `${apiBaseUrl}/trpc`

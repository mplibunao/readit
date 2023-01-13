function getNextUrl() {
	if (process.env.VERCEL_URL)
		return new URL(`https://${process.env.VERCEL_URL}`)
	if (process.env.NEXT_PUBLIC_VERCEL_URL)
		return new URL(`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`)

	return new URL(`http://localhost:${process.env.PORT ?? 3000}`)
}

export const nextBaseUrl = getNextUrl()
export const nextApiBaseUrl = new URL('/api', nextBaseUrl)

export function getApiBaseUrl() {
	if (process.env.NEXT_PUBLIC_API_URL)
		return new URL(process.env.NEXT_PUBLIC_API_URL)
	if (process.env.API_URL) return new URL(process.env.API_URL)

	return new URL('http://localhost:4000')
}

export const trpcUrl = new URL('/trpc', getApiBaseUrl())

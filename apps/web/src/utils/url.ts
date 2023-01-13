function getNextUrl() {
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
	if (process.env.NEXT_PUBLIC_VERCEL_URL)
		return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`

	return `http://localhost:${process.env.PORT ?? 3000}`
}

export const nextBaseUrl = getNextUrl()
console.log('process.env.VERCEL_URL', process.env.VERCEL_URL) // eslint-disable-line no-console
console.log(
	'process.env.NEXT_PUBLIC_VERCEL_URL',
	process.env.NEXT_PUBLIC_VERCEL_URL,
) // eslint-disable-line no-console
console.log('nextBaseUrl', nextBaseUrl) // eslint-disable-line no-console

export function getApiBaseUrl() {
	if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
	if (process.env.API_URL) return process.env.API_URL

	return 'http://localhost:4000/api'
}

export const trpcUrl = `${getApiBaseUrl()}/trpc`

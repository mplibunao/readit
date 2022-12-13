import { env } from '@/env/server.mjs'

function getUrl() {
	if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`

	return `http://localhost:${env.PORT ?? 3000}`
}

export const url = getUrl()

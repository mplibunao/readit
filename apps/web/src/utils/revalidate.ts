import { env } from '@/env/server.mjs'

import { nextFetch } from './request'
import { nextBaseUrl } from './url'

export const revalidate = async (path: string) => {
	const url = new URL('/api/revalidate', nextBaseUrl)
	url.searchParams.set('secret', env.REVALIDATE_TOKEN)
	url.searchParams.set('path', path)
	try {
		return nextFetch<{ revalidated: boolean }>(url.toString())
	} catch (error) {
		console.error('Error: Failed to revalidate', { error, path })
		return Promise.resolve({ revalidated: false })
	}
}

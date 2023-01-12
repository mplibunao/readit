import { nextUrl } from '@/utils/url'
import wretch from 'wretch'

export const nextBaseUrl = wretch(nextUrl)
	.url('/api')
	.errorType('json')
	.resolve((r) => r.json())

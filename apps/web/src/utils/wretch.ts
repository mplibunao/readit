import wretch from 'wretch'

import { clientUrl } from './url'

export const nextApi = wretch(clientUrl)
	.url('/api')
	.errorType('json')
	.resolve((r) => r.json())

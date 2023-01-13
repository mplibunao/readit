import { createRequest } from './createRequest'

export const nextFetch = createRequest({
	headers: { 'Content-Type': 'application/json' },
})

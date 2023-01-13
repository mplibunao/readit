import { createRequest } from './createRequest'

export const nextFetch = createRequest({
	headers: { 'Content-Type': 'application/json' },
})

export const apiFetch = createRequest({
	headers: { 'Content-Type': 'application/json' },
	credentials: 'include',
})

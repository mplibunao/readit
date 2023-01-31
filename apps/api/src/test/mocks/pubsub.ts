import { vi } from 'vitest'

export const createMockPubSubClient = (opts: object = {}) => {
	const publishMessage = vi.fn()
	return {
		publishMessage,
		topic: () => {
			return { publishMessage }
		},
		...opts,
	}
}

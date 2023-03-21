import { vi } from 'vitest'

export const createMockPubSubClient = () => {
	const publishMessage = vi.fn()
	return {
		publishMessage,
		topic: () => {
			return { publishMessage }
		},
	}
}

export type MockPubSubClient = ReturnType<typeof createMockPubSubClient>

import { vi } from 'vitest'

export const createMockSession = (opts: Record<string, unknown> = {}) => {
	return {
		destroy: vi.fn(),
		set: vi.fn(),
		get: vi.fn(),
		...opts,
	}
}

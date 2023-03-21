import { Session } from '@api/infra/session'
import { vi } from 'vitest'

export const createMockSession = (
	opts: Record<string, unknown> = {},
): Session => {
	return {
		destroy: vi.fn(),
		set: vi.fn(),
		get: vi.fn(),
		user: undefined,
		sessionId: '',
		encryptedSessionId: '',
		touch: vi.fn(),
		regenerate: vi.fn(),
		reload: vi.fn(),
		save: vi.fn(),
		isModified: vi.fn(),
		cookie: {},
		...opts,
	}
}

import type { EdgeConfigClient } from '@vercel/edge-config'
import { vi } from 'vitest'

export const buildMockEdgeConfig = (): EdgeConfigClient => {
	return {
		get: vi.fn(),
		has: vi.fn(),
		getAll: vi.fn(),
		digest: vi.fn(),
	}
}

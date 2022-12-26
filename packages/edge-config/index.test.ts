import { describe, vi, afterEach, beforeEach, it, expect } from 'vitest'
import { createClient } from '@vercel/edge-config'
import { EdgeConfig } from '.'

const mock = {
	get: vi.fn(),
	has: vi.fn(),
	getAll: vi.fn(),
}

vi.mock('@vercel/edge-config', () => {
	const createClient = vi.fn(() => mock)

	return { createClient }
})

describe('EdgeConfig', () => {
	afterEach(() => {
		vi.clearAllMocks()
	})

	let edgeConfig: EdgeConfig

	beforeEach(() => {
		const client = createClient('connectionString')
		edgeConfig = new EdgeConfig({
			appName: 'APP_NAME',
			client,
			logErrors: true,
		})
	})

	describe('getConfig', () => {
		it('should return the key if it exists', async () => {
			mock.get.mockResolvedValueOnce(true)
			mock.has.mockResolvedValueOnce(true)

			const result = await edgeConfig.getConfig('SOME_FIELD', false)
			expect(result).toBe(true)
		})

		it('should return the fallback if the key does not exist', async () => {
			mock.get.mockResolvedValueOnce(undefined)
			mock.has.mockResolvedValueOnce(false)

			const result = await edgeConfig.getConfig('SOME_FIELD', true)
			expect(result).toBe(true)
		})
	})
})

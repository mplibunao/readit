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
		vi.restoreAllMocks()
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

	describe('getAllConfig', () => {
		it('should return all the keys if they all exist', async () => {
			mock.has.mockResolvedValueOnce(true).mockResolvedValueOnce(true)
			mock.get.mockResolvedValueOnce(true).mockResolvedValueOnce(false)

			const result = await edgeConfig.getAllConfig(
				['SOME_FIELD', 'SOME_OTHER_FIELD'],
				[true, true]
			)
			expect(result).toEqual({
				SOME_FIELD: true,
				SOME_OTHER_FIELD: false,
			})
		})

		it('should return the value for existing keys and the fallback for non-existing keys', async () => {
			mock.has.mockResolvedValueOnce(true).mockResolvedValueOnce(false)
			mock.get.mockResolvedValueOnce(true)

			const result = await edgeConfig.getAllConfig(
				['SOME_FIELD', 'SOME_OTHER_FIELD'],
				[true, true]
			)
			expect(result).toEqual({
				SOME_FIELD: true,
				SOME_OTHER_FIELD: true,
			})
		})
	})
})

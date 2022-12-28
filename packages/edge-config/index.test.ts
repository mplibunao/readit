import { describe, vi, afterEach, beforeEach, it, expect } from 'vitest'
import { createClient } from '@vercel/edge-config'
import { EdgeConfig } from '.'

const mockClient = {
	get: vi.fn(),
	has: vi.fn(),
	getAll: vi.fn(),
}

const mockLogger = {
	error: (...data: unknown[]) => data,
}

vi.mock('@vercel/edge-config', () => {
	const createClient = vi.fn(() => mockClient)

	return { createClient }
})

describe('EdgeConfig', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	let edgeConfig: EdgeConfig
	const logSpy = vi.spyOn(mockLogger, 'error')

	beforeEach(() => {
		const client = createClient('connectionString')
		edgeConfig = new EdgeConfig({
			appName: 'APP_NAME',
			client,
			onError: (err) => {
				mockLogger.error(err, 'Failed to get config')
			},
		})
	})

	describe('getConfig', () => {
		it('should return the key if it exists', async () => {
			mockClient.get.mockResolvedValueOnce(true)
			mockClient.has.mockResolvedValueOnce(true)

			const result = await edgeConfig.getConfig('SOME_FIELD', false)
			expect(result).toBe(true)
		})

		it('should return the fallback if the key does not exist', async () => {
			mockClient.get.mockResolvedValueOnce(undefined)
			mockClient.has.mockResolvedValueOnce(false)

			const result = await edgeConfig.getConfig('SOME_FIELD', true)
			expect(result).toBe(true)
		})

		it('should call onError callback and return fallback if an error occurs', async () => {
			mockClient.get.mockRejectedValueOnce(new Error('Some error'))
			mockClient.has.mockResolvedValueOnce(true)

			const result = await edgeConfig.getConfig('SOME_FIELD', true)
			expect(result).toBe(true)
			expect(logSpy).toHaveBeenCalledTimes(1)
			expect(logSpy).toBeCalledWith(
				new Error('Some error'),
				'Failed to get config'
			)
		})
	})

	describe('getAllConfig', () => {
		it('should return all the keys if they all exist', async () => {
			mockClient.has.mockResolvedValueOnce(true).mockResolvedValueOnce(true)
			mockClient.get.mockResolvedValueOnce(true).mockResolvedValueOnce(false)

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
			mockClient.has.mockResolvedValueOnce(true).mockResolvedValueOnce(false)
			mockClient.get.mockResolvedValueOnce(true)

			const result = await edgeConfig.getAllConfig(
				['SOME_FIELD', 'SOME_OTHER_FIELD'],
				[true, true]
			)
			expect(result).toEqual({
				SOME_FIELD: true,
				SOME_OTHER_FIELD: true,
			})
		})

		it('should call onError callback and return all fallback values if an error occurs', async () => {
			mockClient.has.mockResolvedValueOnce(true).mockResolvedValueOnce(true)
			mockClient.get
				.mockResolvedValueOnce(false)
				.mockRejectedValueOnce(new Error('Some error'))

			const result = await edgeConfig.getAllConfig(
				['SOME_FIELD', 'SOME_OTHER_FIELD'],
				[true, true]
			)
			expect(result).toEqual({
				SOME_FIELD: true,
				SOME_OTHER_FIELD: true,
			})
			expect(logSpy).toHaveBeenCalledTimes(1)
			expect(logSpy).toBeCalledWith(
				new Error('Some error'),
				'Failed to get config'
			)
		})
	})
})

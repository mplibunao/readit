import { createClient } from '@vercel/edge-config'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FlagsRepo } from './flags.repo'
import { FlagsService } from './flags.service'

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

describe('FlagsService', () => {
	afterEach(() => {
		vi.restoreAllMocks()
	})

	let Service: FlagsService
	let Repo: FlagsRepo
	const logSpy = vi.spyOn(mockLogger, 'error')

	beforeEach(() => {
		const client = createClient('connectionString')
		Repo = new FlagsRepo(client)
		Service = new FlagsService({
			appName: 'APP_NAME',
			flagsRepo: Repo,
			onError: (err) => {
				mockLogger.error(err, 'Failed to get config')
			},
		})
	})

	describe('get() gets a single flag', () => {
		it('should return the key if it exists', async () => {
			mockClient.get.mockResolvedValueOnce(true)
			mockClient.has.mockResolvedValueOnce(true)

			const result = await Service.get('SOME_FIELD', false)
			expect(result).toBe(true)
		})

		it('should return the fallback if the key does not exist', async () => {
			mockClient.get.mockResolvedValueOnce(undefined)
			mockClient.has.mockResolvedValueOnce(false)

			const result = await Service.get('SOME_FIELD', true)
			expect(result).toBe(true)
		})

		it('should call onError callback and return fallback if an error occurs', async () => {
			mockClient.get.mockRejectedValueOnce(new Error('Some error'))
			mockClient.has.mockResolvedValueOnce(true)

			const result = await Service.get('SOME_FIELD', true)
			expect(result).toBe(true)
			expect(logSpy).toHaveBeenCalledTimes(1)
			expect(logSpy).toBeCalledWith(
				new Error('Some error'),
				'Failed to get config',
			)
		})
	})

	describe('getAll gets multiple flags', () => {
		it('should return all the keys if they all exist', async () => {
			mockClient.has.mockResolvedValueOnce(true).mockResolvedValueOnce(true)
			mockClient.get.mockResolvedValueOnce(true).mockResolvedValueOnce(false)

			const result = await Service.getAll(
				['SOME_FIELD', 'SOME_OTHER_FIELD'],
				[true, true],
			)
			expect(result).toEqual({
				SOME_FIELD: true,
				SOME_OTHER_FIELD: false,
			})
		})

		it('should return the value for existing keys and the fallback for non-existing keys', async () => {
			mockClient.has.mockResolvedValueOnce(true).mockResolvedValueOnce(false)
			mockClient.get.mockResolvedValueOnce(true)

			const result = await Service.getAll(
				['SOME_FIELD', 'SOME_OTHER_FIELD'],
				[true, true],
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

			const result = await Service.getAll(
				['SOME_FIELD', 'SOME_OTHER_FIELD'],
				[true, true],
			)
			expect(result).toEqual({
				SOME_FIELD: true,
				SOME_OTHER_FIELD: true,
			})
			expect(logSpy).toHaveBeenCalledTimes(1)
			expect(logSpy).toBeCalledWith(
				new Error('Some error'),
				'Failed to get config',
			)
		})
	})
})

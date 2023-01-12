import { BaseFlagsRepo } from './flags.repo'

interface BaseFlagsService {
	get<T>(key: string, fallback: T): Promise<T | undefined>
	getAll(
		keys: string[],
		fallback: unknown[],
	): Promise<{ [key: string]: unknown }>
}

export interface FlagsServiceOptions {
	flagsRepo: BaseFlagsRepo
	appName: string
	env?: string
	onError?: (err: unknown) => void
}

export class FlagsService implements BaseFlagsService {
	private flagsRepo: BaseFlagsRepo
	private appName: string
	private env?: string
	private onError?: (err: unknown) => void

	constructor(params: FlagsServiceOptions) {
		this.flagsRepo = params.flagsRepo
		this.appName = params.appName
		this.env = params.env?.toUpperCase()
		this.onError = params.onError
	}

	private getFullKey(key: string) {
		return this.env
			? `${this.appName}_${this.env}_${key}`
			: `${this.appName}_${key}`
	}

	async get<T>(key: string, fallback: T) {
		try {
			const fullKey = this.getFullKey(key)
			return (await this.flagsRepo.has(fullKey))
				? await this.flagsRepo.get<T>(fullKey)
				: fallback
		} catch (e) {
			this.onError && this.onError(e)
			return fallback
		}
	}

	async getAll(keys: string[], fallback: unknown[]) {
		try {
			const flags = await Promise.all(
				keys.map(async (key, index) => {
					const fullKey = this.getFullKey(key)
					const exists = await this.flagsRepo.has(fullKey)
					const value = exists
						? await this.flagsRepo.get(fullKey)
						: fallback[index]
					return { [key]: value }
				}),
			)

			return flags.reduce((acc, flag) => ({ ...acc, ...flag }), {})
		} catch (e) {
			this.onError && this.onError(e)

			return keys
				.map((key, index) => ({ [key]: fallback[index] }))
				.reduce((acc, flag) => ({ ...acc, ...flag }), {})
		}
	}
}

import { EdgeConfigClient } from '@vercel/edge-config'

export interface EdgeConfigOptions {
	client: EdgeConfigClient
	appName: string
	env?: string
	onError?: (err: unknown) => void
}

export class EdgeConfig {
	private client: EdgeConfigClient
	private appName: string
	private env?: string
	private onError?: (err: unknown) => void

	constructor({ client, appName, env = '', onError }: EdgeConfigOptions) {
		this.client = client
		this.appName = appName.toUpperCase()
		this.env = env.toUpperCase()
		this.onError = onError
	}

	private get<T>(key: string) {
		return this.client.get<T>(key)
	}

	private has(key: string) {
		return this.client.has(key)
	}

	private getFullKey(key: string) {
		return this.env
			? `${this.appName}_${this.env}_${key}`
			: `${this.appName}_${key}`
	}

	async getConfig<T>(key: string, fallback: T) {
		try {
			const fullKey = this.getFullKey(key)
			return (await this.has(fullKey)) ? await this.get<T>(fullKey) : fallback
		} catch (e) {
			this.onError && this.onError(e)
			return fallback
		}
	}

	async getAllConfig(keys: string[], fallback: unknown[]) {
		try {
			const flags = await Promise.all(
				keys.map(async (key, index) => {
					const fullKey = this.getFullKey(key)
					const exists = await this.has(fullKey)
					const value = exists ? await this.get(fullKey) : fallback[index]
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

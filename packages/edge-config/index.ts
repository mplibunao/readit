import { EdgeConfigClient } from '@vercel/edge-config'
import pino from 'pino'

type Logger = Console | pino.BaseLogger

export interface EdgeConfigOptions {
	client: EdgeConfigClient
	appName: string
	logger?: Logger
	logErrors?: boolean
	env?: string
}

export class EdgeConfig {
	private client: EdgeConfigClient
	private appName: string
	private logger: Logger
	private logErrors: boolean
	private env?: string

	constructor({
		client,
		appName,
		logger = console,
		logErrors = false,
		env = '',
	}: EdgeConfigOptions) {
		this.client = client
		this.appName = appName.toUpperCase()
		this.logger = logger
		this.logErrors = logErrors
		this.env = env.toUpperCase()
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
			if (this.logErrors) {
				this.logger.error(e, 'Failed to get config')
			}
			return fallback
		}
	}

	async getAllConfig(keys: string[], fallback: unknown[]) {
		try {
			const flags = await Promise.all(
				keys.map(async (key, index) => {
					const fullKey = this.getFullKey(key)
					const value = (await this.has(fullKey))
						? await this.get(fullKey)
						: fallback[index]
					return { [key]: value }
				})
			)

			return flags.reduce((acc, flag) => ({ ...acc, ...flag }), {})
		} catch (e) {
			if (this.logErrors) {
				this.logger.error(e, 'Failed to get config')
			}

			return keys
				.map((key, index) => ({ [key]: fallback[index] }))
				.reduce((acc, flag) => ({ ...acc, ...flag }), {})
		}
	}
}

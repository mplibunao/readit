import { EdgeConfigClient } from '@vercel/edge-config'

export interface BaseFlagsRepo {
	get<T>(key: string): Promise<T | undefined>
	has(key: string): Promise<Boolean>
}

export class FlagsRepo implements BaseFlagsRepo {
	constructor(private readonly client: EdgeConfigClient) {
		this.client = client
	}

	async get<T>(key: string): Promise<T | undefined> {
		return this.client.get<T>(key)
	}

	async has(key: string): Promise<Boolean> {
		return this.client.has(key)
	}
}

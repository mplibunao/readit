import { get, has } from '@vercel/edge-config'

export async function getConfig<T>(key: string, fallback: T) {
	try {
		return Boolean(await has(key)) ? await get(key) : fallback
	} catch (error) {
		return fallback
	}
}

export async function getAllConfig(keys: string[], fallback: unknown[]) {
	try {
		const flags = await Promise.all(
			keys.map(async (key, index) => {
				const value = Boolean(await has(key)) ? await get(key) : fallback[index]
				return { [key]: value }
			})
		)
		return flags.reduce((acc, curr) => ({ ...acc, ...curr }), {})
	} catch (error) {
		return fallback
	}
}

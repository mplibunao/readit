type CustomOptions = {
	timeout?: number
}

export const createRequest = (
	defaultOptions: RequestInit = {},
	defaultCustomOptions: CustomOptions = {},
) => {
	defaultOptions.credentials = defaultOptions.credentials ?? 'same-origin'
	defaultOptions.mode = defaultOptions.mode ?? 'cors'

	return async <T>(
		url: string,
		options: RequestInit = { method: 'GET' },
		customOptions: CustomOptions = {},
	): Promise<T> => {
		let response: Response
		const timeout = customOptions.timeout ?? defaultCustomOptions.timeout ?? 0

		if (timeout > 0) {
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => {
					reject(new Error('Request timed out'))
				}, timeout)
			})

			response = (await Promise.race([
				fetch(url, {
					...defaultOptions,
					...options,
				}),
				timeoutPromise,
			])) as Response
		} else {
			response = await fetch(url, {
				...defaultOptions,
				...options,
			})
		}

		if (!response.ok) throw new Error('Network response was not OK')
		if (response.status === 204) return '' as T

		let data

		try {
			data = await response.json()
		} catch (err) {
			data = await response.text()
		}

		return data as T
	}
}

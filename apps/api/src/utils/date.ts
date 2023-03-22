export const getTTL = (seconds: number): Date => {
	const ms = seconds * 1000
	const now = new Date()
	return new Date(now.getTime() + ms)
}

export const HOUR_IN_SECONDS = 3600
export const MINUTE_IN_SECONDS = 60

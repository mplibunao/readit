export const getTTL = (seconds: number): Date => {
	const ms = seconds * 1000
	const now = new Date()
	return new Date(now.getTime() + ms)
}

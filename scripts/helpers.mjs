export const humanReadableProcessHrtime = ([seconds, nanoseconds]) => {
	const ms = nanoseconds / 1000000
	return `${seconds}s${ms}ms`
}

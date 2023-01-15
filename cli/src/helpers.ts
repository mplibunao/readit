export const humanReadableProcessHrtime = ([seconds, nanoseconds]: [
	number,
	number,
]) => {
	const ms = nanoseconds / 1000000
	return `${seconds}s${ms}ms`
}

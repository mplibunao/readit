/*
 * Use console.log for tests since vitest doesn't show the pino logs which make debugging failing tests difficult
 * However, only show error logs to avoid getting spammed by non-error logs
 */

export const testLogger = {
	error: console.error,
	fatal: console.error,
	warn: console.warn,
	debug: console.debug,
	trace: console.trace,
	log: (_: any) => {},
	info: (_: any) => {},
}

export const silentLogger = {
	error: (_: any) => {},
	fatal: (_: any) => {},
	warn: (_: any) => {},
	debug: (_: any) => {},
	trace: (_: any) => {},
	log: (_: any) => {},
	info: (_: any) => {},
}

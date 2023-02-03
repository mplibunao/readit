/*
 * Use console.log for tests since vitest doesn't show the pino logs which make debugging failing tests difficult
 * However, only show error logs to avoid getting spammed by non-error logs
 */

export const testLogger = {
	error: console.error,
	fatal: console.error,
	warn: console.warn,
	log: () => {},
	info: () => {},
}

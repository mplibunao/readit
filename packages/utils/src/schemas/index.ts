import { z } from 'zod'

export * from './password'

export const DateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
	return null
}, z.date())

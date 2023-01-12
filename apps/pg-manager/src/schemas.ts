import { z } from 'zod'

export const BooleanSchema = z.preprocess((arg) => {
	if (typeof arg === 'string') return arg === 'true'
	return Boolean(arg)
}, z.boolean())

export const NumberSchema = z.preprocess((arg) => Number(arg), z.number())

import { z } from 'zod'

export * from './password'

//export const DateSchema = z.preprocess((arg) => {
//if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
//return
//}, z.date())

//export const BooleanSchema = z.preprocess((arg) => {
//if (typeof arg === 'string') return arg === 'true'
//return Boolean(arg)
//}, z.boolean())

//export const NumberSchema = z.preprocess((arg) => Number(arg), z.number())

export const PortSchema = z.number().int().nonnegative().lte(65535)

export const id = z.string()
export const createdAt = z.coerce.date()
export const updatedAt = z.coerce.date()
export const deletedAt = z.coerce.date().nullable()

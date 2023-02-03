import { createdAt, id, updatedAt } from '@readit/utils'
import { z } from 'zod'

export const userId = z.string()
export const type = z.literal('accountActivation')
export const usedAt = z.coerce.date().nullable()

export const tokenSchema = z.object({
	id,
	createdAt,
	updatedAt,
	userId,
	type,
	usedAt,
})
export type TokenSchema = z.infer<typeof tokenSchema>

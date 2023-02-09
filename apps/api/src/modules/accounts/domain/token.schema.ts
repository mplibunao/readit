import { id } from '@readit/utils'
import { z } from 'zod'

export const createTokenSchema = z.union([
	z.object({
		userId: id,
		type: z.literal('accountActivation'),
	}),
	z.object({
		userId: id,
		type: z.literal('login'),
		expiresAt: z.coerce.date(),
	}),
])
export type CreateTokenSchema = z.infer<typeof createTokenSchema>

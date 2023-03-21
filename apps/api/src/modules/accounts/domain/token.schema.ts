import { id } from '@readit/utils'
import { z } from 'zod'

export * as TokenSchemas from './token.schema'

const type = z.union([
	z.literal('accountActivation'),
	z.literal('passwordReset'),
	z.literal('emailChange'),
	z.literal('login'),
])

export const token = z.object({
	id,
	userId: id,
	type,
})
export type Token = z.infer<typeof token>
export const createTokenInput = z.object({
	userId: id,
	type,
	expirationTimeInSeconds: z.number().positive(),
})
export type CreateTokenInput = z.infer<typeof createTokenInput>

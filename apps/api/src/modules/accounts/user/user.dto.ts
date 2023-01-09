import { DateSchema, PasswordSchema } from '@readit/utils/src/schemas'
import { z } from 'zod'

export * as UserDto from './user.dto'

const id = z.string().uuid()

const registerSchema = {
	email: z.string().trim().email({ message: 'Should be a valid email' }),
	firstName: z.string().trim().min(2),
	lastName: z.string().trim().min(2),
}
const registerOutputSchema = {
	...registerSchema,
	id,
	createdAt: DateSchema,
	updatedAt: DateSchema,
}

export const registerInput = z.object({
	...registerSchema,
	password: PasswordSchema,
})

export const registerOutput = z.object(registerOutputSchema)

export type RegisterOutput = z.infer<typeof registerOutput>

export const userByIdInput = z.object({
	id,
})

export const userByIdOutput = z.object({
	...registerOutputSchema,
	id,
	deletedAt: DateSchema,
})

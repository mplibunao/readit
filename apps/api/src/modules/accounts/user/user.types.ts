import { DateSchema, PasswordSchema } from '@readit/utils/src/schemas'
import { z } from 'zod'

export * as UserTypes from './user.types'

const registerSchema = {
	email: z.string().trim().email({ message: 'Should be a valid email' }),
	firstName: z.string().trim().min(2),
	lastName: z.string().trim().min(2),
}
const id = z.string().uuid()

export const createUserSchema = z.object({
	...registerSchema,
	password: PasswordSchema,
})

export type CreateUserSchema = z.infer<typeof createUserSchema>

export const userSchema = z.object({
	...registerSchema,
	id,
	updatedAt: DateSchema,
	deletedAt: DateSchema.nullable(),
})

export type UserSchema = z.infer<typeof userSchema>

export const findByIdSchema = z.object({ id })

export type FindByIdSchema = z.infer<typeof findByIdSchema>

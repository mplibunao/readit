import {
	createdAt,
	deletedAt,
	PasswordSchema,
	updatedAt,
} from '@readit/utils/src/schemas'
import { z } from 'zod'

export * as User from './user.types'

export const id = z.string()
export const email = z
	.string()
	.trim()
	.email({ message: 'Should be a valid email' })
export const firstName = z.string().trim().min(2)
export const lastName = z.string().trim().min(2)
export const password = PasswordSchema

export const userSchema = z.promise(
	z.object({
		id,
		email,
		firstName,
		lastName,
		createdAt,
		updatedAt,
		deletedAt,
	}),
)
export type UserSchema = z.infer<typeof userSchema>

export const createUserInput = z.object({
	email,
	firstName,
	lastName,
	password,
})
export type CreateUserInput = z.infer<typeof createUserInput>
export const createUserOutput = z.promise(
	z.object({
		id,
		email,
		firstName,
		lastName,
	}),
)
export type CreateUserOutput = z.infer<typeof createUserOutput>

export const findByIdInput = id
export type FindByIdInput = z.infer<typeof findByIdInput>

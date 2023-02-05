import {
	createdAt,
	deletedAt,
	id,
	PasswordSchema,
	updatedAt,
} from '@readit/utils/src/schemas'
import { z } from 'zod'

export * as UserSchemas from './user.schema'

export const email = z
	.string()
	.trim()
	.email({ message: 'Please enter a valid email' })
export const firstName = z
	.string()
	.trim()
	.min(3, 'Please enter at least 3 characters')
export const lastName = z
	.string()
	.trim()
	.min(3, 'Please enter at least 3 characters')
export const username = z
	.string()
	.trim()
	.min(3, 'Please enter at least 3 characters')
export const password = PasswordSchema
export const profileUrl = z.string().url()
export const confirmedAt = z.coerce.date().nullable()

export const user = z.object({
	id,
	email,
	firstName,
	lastName,
	username,
	createdAt,
	updatedAt,
	deletedAt,
	confirmedAt,
})
export type User = z.infer<typeof user>
export const createUserInput = z.object({
	email,
	firstName,
	lastName,
	username,
	password,
})
export type CreateUserInput = z.infer<typeof createUserInput>
export const createUserOutput = z.object({
	id,
	email,
	firstName,
	lastName,
	username,
})
export type CreateUserOutput = z.infer<typeof createUserOutput>
export const findByIdInput = id
export type FindByIdInput = z.infer<typeof findByIdInput>
export const loginInput = z.object({
	password,
	usernameOrEmail: z.union([username, email]),
})
export type LoginInput = z.infer<typeof loginInput>

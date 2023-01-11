import { PasswordSchema } from '@readit/utils/src/schemas'
import { z } from 'zod'

export * as UserTypes from './user.types'

const id = z.string()
const email = z.string().trim().email({ message: 'Should be a valid email' })
const firstName = z.string().trim().min(2)
const lastName = z.string().trim().min(2)
const password = PasswordSchema
const createdAt = z.coerce.date()
const updatedAt = z.coerce.date()
const deletedAt = z.coerce.date().nullable()

export const createUserInput = z.object({
	email,
	firstName,
	lastName,
	password,
})
export type CreateUserInput = z.infer<typeof createUserInput>
export const createUserOutput = z.object({
	id,
	email,
	firstName,
	lastName,
})
export type CreateUserOutput = z.infer<typeof createUserOutput>

export const userSchema = z.object({
	id,
	email,
	firstName,
	lastName,
	createdAt,
	updatedAt,
	deletedAt,
})

export type UserSchema = z.infer<typeof userSchema>

export const findByIdSchema = id

export type FindByIdSchema = z.infer<typeof findByIdSchema>

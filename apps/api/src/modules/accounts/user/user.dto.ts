import { PasswordSchema } from '@readit/utils/src/schemas'
import { z } from 'zod'

export * as UserDto from './user.dto'

const id = z.string()
const email = z.string().trim().email({ message: 'Should be a valid email' })
const firstName = z.string().trim().min(2)
const lastName = z.string().trim().min(2)
const password = PasswordSchema
const createdAt = z.coerce.date()
const updatedAt = z.coerce.date()
const deletedAt = z.coerce.date().nullable()

export const registerInput = z.object({ email, firstName, lastName, password })
export const registerOutput = z.object({
	id,
	email,
	firstName,
	lastName,
})
export const userByIdInput = z.object({ id })
export const userByIdOutput = z.object({
	id,
	email,
	firstName,
	lastName,
	createdAt,
	updatedAt,
	deletedAt,
})

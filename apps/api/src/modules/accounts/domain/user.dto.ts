import { createdAt, deletedAt, id, updatedAt } from '@readit/utils'
import { z } from 'zod'

import { email, firstName, lastName, password, username } from './user.types'

export * as UserDto from './user.dto'

export const registerInput = z.object({
	email,
	firstName,
	lastName,
	password,
	username,
})
export const registerOutput = z.object({
	id,
	email,
	firstName,
	lastName,
	username,
})
export type RegisterOutput = z.infer<typeof registerOutput>
export const userByIdInput = z.object({ id })
export const userByIdOutput = z.object({
	id,
	email,
	firstName,
	lastName,
	username,
	createdAt,
	updatedAt,
	deletedAt,
})

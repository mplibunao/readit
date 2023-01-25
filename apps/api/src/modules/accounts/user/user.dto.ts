import { createdAt, deletedAt, updatedAt } from '@readit/utils'
import { z } from 'zod'

import { email, firstName, id, lastName, password } from './user.types'

export * as UserDto from './user.dto'

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

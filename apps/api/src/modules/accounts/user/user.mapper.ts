import { UserData } from '@api/infra/pg'

import { CreateUserSchema, createUserSchema } from './user.types'

export * as UserMapper from './user.mapper'

export const toDomain = (user: Partial<UserData>): CreateUserSchema => {
	return createUserSchema.parse(user)
}

import { InsertableSocialAccount, InsertableUser } from '@api/infra/pg/types'
import { randomUUID } from 'crypto'

export const createTestUser = (
	user?: Partial<InsertableUser>,
): InsertableUser => ({
	email: 'john@example.com',
	username: 'john',
	firstName: 'John',
	lastName: 'Doe',
	...user,
})

export const createSocialAccount = (
	socialAccount?: Partial<InsertableSocialAccount>,
): InsertableSocialAccount => ({
	provider: 'google',
	socialId: '1234567890',
	userId: randomUUID(),
	usernameOrEmail: 'john@example.com',
	...socialAccount,
})

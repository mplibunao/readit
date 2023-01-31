import { User } from '@api/modules/accounts/domain/user.types'

export const capitalize = (word: string) =>
	word.charAt(0).toUpperCase() + word.slice(1)

export const getFullName = (user: Partial<User.UserSchema>) => {
	if (!user) return ''
	const firstName = user.firstName
	const lastName = user.lastName

	if (firstName && !lastName) {
		return firstName
	} else if (lastName && !firstName) {
		return lastName
	} else if (firstName && lastName) {
		return `${firstName} ${lastName}`
	} else {
		return ''
	}
}

import { UserSchemas } from '@api/modules/accounts/domain/user.schema'

export const capitalize = (word: string) =>
	word.charAt(0).toUpperCase() + word.slice(1)

export const getFullName = (user: Partial<UserSchemas.User>) => {
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

import { UserSchemas } from '@api/modules/accounts/domain/user.schema'

export const capitalize = (word?: string) =>
	word ? word.charAt(0).toUpperCase() + word.slice(1) : `${word}`

export const getFullName = (user?: Partial<UserSchemas.User>) => {
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

export const generateCode = (length: number): string => {
	const result = []
	const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
	}
	return result.join('')
}

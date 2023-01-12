import { describe, expect, test } from 'vitest'

import { PasswordSchema } from '../password'

describe('Password schema', () => {
	test('should be at least 8 characters', () => {
		expect(() => PasswordSchema.parse('aA34567')).toThrow()

		const result = PasswordSchema.safeParse('aA34567')

		if (!result.success) {
			expect(result.success).toBe(false)
			expect(result.error.issues.length).toEqual(1)
			expect(result.error.issues[0]?.message).toEqual(
				'Password should be at least 8 characters',
			)
		}

		expect(() => PasswordSchema.parse('aA345678')).not.toThrow()
	})

	test("spaces don't count towards character limit", () => {
		expect(() => PasswordSchema.parse('aA34567 ')).toThrow()
	})

	test('should contain at least one lowercase letter', () => {
		expect(() => PasswordSchema.parse('A12345678')).toThrow()

		const result = PasswordSchema.safeParse('A12345678')
		if (!result.success) {
			expect(result.success).toBe(false)
			expect(result.error.issues.length).toEqual(1)
			expect(result.error.issues[0]?.message).toEqual(
				'Password should contain at least one lowercase letter',
			)
		}

		expect(() => PasswordSchema.parse('aA12345678')).not.toThrow()
	})

	test('should contain at least one uppercase letter', () => {
		expect(() => PasswordSchema.parse('a12345678')).toThrow()

		const result = PasswordSchema.safeParse('a12345678')
		if (!result.success) {
			expect(result.success).toBe(false)
			expect(result.error.issues.length).toEqual(1)
			expect(result.error.issues[0]?.message).toEqual(
				'Password should contain at least one uppercase letter',
			)
		}

		expect(() => PasswordSchema.parse('aA12345678')).not.toThrow()
	})

	test('should contain at least one number', () => {
		expect(() => PasswordSchema.parse('aAabcdefgh')).toThrow()

		const result = PasswordSchema.safeParse('aAabcdefgh')
		if (!result.success) {
			expect(result.success).toBe(false)
			expect(result.error.issues.length).toEqual(1)
			expect(result.error.issues[0]?.message).toEqual(
				'Password should contain at least one number',
			)
		}

		expect(() => PasswordSchema.parse('aA12345678')).not.toThrow()
	})
})

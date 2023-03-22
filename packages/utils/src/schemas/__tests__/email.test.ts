import { describe, expect, test } from 'vitest'

import { email } from '..'

describe('email schema', () => {
	test('should still check for valid email', () => {
		expect(() => email.parse('test')).toThrow()
		const res = email.safeParse('testaeu')

		if (!res.success) {
			expect(res.error.issues[0]?.message).toEqual('Please enter a valid email')
		}

		expect(() => email.parse('test@example.com')).not.toThrow()
	})

	test('should remove . for gmail', () => {
		expect(email.parse('mark.paolo.libunao@gmail.com')).toBe(
			'markpaololibunao@gmail.com',
		)
	})
})

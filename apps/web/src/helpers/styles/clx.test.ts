import { clsx } from './clsx'

describe('boolToClass', () => {
	it('should return the className if boolean is true', () => {
		expect(clsx(true, 'test')).toBe('test')
	})

	it('should return undefined if boolean is false', () => {
		expect(clsx(false, 'test')).toBe(undefined)
	})

	it('should accept non-boolean types and check if they are falsy or truthy', () => {
		expect(clsx('true', 'test')).toBe('test')
		expect(clsx('false', 'test')).toBe('test')
		expect(clsx('', 'test')).toBe(undefined)
	})
})

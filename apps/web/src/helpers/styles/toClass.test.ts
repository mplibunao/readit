import { toClass } from './toClass'

describe('boolToClass', () => {
	it('should return the className if boolean is true', () => {
		expect(toClass(true, 'test')).toBe('test')
	})

	it('should return undefined if boolean is false', () => {
		expect(toClass(false, 'test')).toBe(undefined)
	})

	it('should accept non-boolean types and check if they are falsy or truthy', () => {
		expect(toClass('true', 'test')).toBe('test')
		expect(toClass('false', 'test')).toBe('test')
		expect(toClass('', 'test')).toBe(undefined)
	})
})

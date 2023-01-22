import { testA11y } from '@/helpers/test/accessibility'
import { render, screen } from '@testing-library/react'
import { FieldError } from 'react-hook-form'

import { TextareaGroup, textareaGroupDefaultProps } from '../TextareaGroup'

describe('a11y', () => {
	it('passes a11y in default state', async () => {
		await testA11y(<TextareaGroup {...textareaGroupDefaultProps} />)
	})

	it('passes a11y test in when required', async () => {
		await testA11y(<TextareaGroup {...textareaGroupDefaultProps} required />)
	})

	it('passes a11y test when with error', async () => {
		await testA11y(
			<TextareaGroup
				{...textareaGroupDefaultProps}
				errors={{
					email: {
						message: 'Invalid email',
					} as FieldError,
				}}
			/>,
		)
	})

	test('has the proper aria attributes', async () => {
		const { rerender } = render(
			<TextareaGroup
				{...textareaGroupDefaultProps}
				helperText='This is a helper text'
				cornerHint='This is a corner hint'
			/>,
		)
		const input = screen.getByLabelText(/Email/)

		expect(input).toHaveAttribute('aria-invalid', 'false')
		expect(input).toHaveAttribute('aria-required', 'false')
		expect(input).toHaveAttribute('aria-readonly', 'false')
		expect(input).toHaveAttribute(
			'aria-describedby',
			`${screen.getByTestId('input-helper-text').id} ${
				screen.getByTestId('input-corner-hint').id
			}`,
		)

		rerender(
			<TextareaGroup
				{...textareaGroupDefaultProps}
				required
				errors={{
					email: {
						message: 'Invalid email',
					} as FieldError,
				}}
				readOnly
				cornerHint='This is a corner hint'
			/>,
		)

		const indicator = screen.getByRole('presentation', { hidden: true })
		const errorMessage = screen.getByTestId('input-error-message')
		expect(input).toHaveAttribute('aria-invalid', 'true')
		expect(input).toHaveAttribute('aria-required', 'true')
		expect(input).toHaveAttribute('aria-readonly', 'true')
		expect(indicator).toHaveAttribute('aria-hidden')
		expect(errorMessage).toHaveAttribute('aria-live', 'polite')
		expect(input).toHaveAttribute(
			'aria-describedby',
			`${errorMessage.id} ${screen.getByTestId('input-corner-hint').id}`,
		)
	})

	test('has the correct role attributes', () => {
		render(<TextareaGroup {...textareaGroupDefaultProps} required />)

		const control = screen.getByTestId('input-control')
		expect(
			screen.getByRole('presentation', { hidden: true }),
		).toBeInTheDocument()
		expect(screen.getByRole('group')).toEqual(control)
	})
})

describe('indicators', () => {
	test('only displays error icon and message when react-hook-form passes an matching error object', () => {
		const { rerender } = render(
			<TextareaGroup
				{...textareaGroupDefaultProps}
				errors={{
					email: {
						message: 'Invalid email',
					} as FieldError,
				}}
			/>,
		)

		expect(screen.getByText('Invalid email')).toBeInTheDocument()
		expect(screen.getByTestId('input-error-icon')).toBeInTheDocument()

		rerender(<TextareaGroup {...textareaGroupDefaultProps} />)

		expect(screen.queryByText('Invalid email')).not.toBeInTheDocument()
		expect(screen.queryByTestId('input-error-icon')).not.toBeInTheDocument()

		rerender(
			<TextareaGroup
				{...textareaGroupDefaultProps}
				errors={{
					password: {
						message: 'Invalid password',
					} as FieldError,
				}}
			/>,
		)

		expect(screen.queryByText('Invalid password')).not.toBeInTheDocument()
		expect(screen.queryByTestId('input-error-icon')).not.toBeInTheDocument()
	})

	test('only displays required indicator when required', () => {
		const { rerender } = render(
			<TextareaGroup {...textareaGroupDefaultProps} required />,
		)

		const indicator = screen.getByRole('presentation', { hidden: true })

		expect(indicator).toBeVisible()
		expect(indicator).toHaveTextContent('*')

		rerender(<TextareaGroup {...textareaGroupDefaultProps} />)

		expect(
			screen.queryByRole('presentation', { hidden: true }),
		).not.toBeInTheDocument()
	})
})

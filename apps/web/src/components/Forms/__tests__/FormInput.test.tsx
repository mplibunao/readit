import { renderWithReactHookForm } from '@/helpers/test/render'
import { fireEvent, act, screen, waitFor } from '@testing-library/react'
import { z } from 'zod'

import { FormInput } from '../FormInput'

describe('FormInput', () => {
	test('should show validation errors value is invalid', async () => {
		renderWithReactHookForm(
			<FormInput
				name='firstName'
				placeholder='John'
				label='First Name'
				required
			/>,
			{
				useFormProps: {
					defaultValues: {
						firstName: '',
					},
					schema: z.object({
						firstName: z
							.string()
							.min(3, { message: 'Please enter at least 3 characters.' }),
					}),
				},
			},
		)

		fireEvent.input(screen.getByTestId('input'), {
			target: { value: 'ab' },
		})

		expect(screen.getByTestId('input')).toHaveValue('ab')

		expect(
			await screen.findByText('Please enter at least 3 characters.'),
		).toBeVisible()
	})

	test('should not display validation errors', async () => {
		renderWithReactHookForm(
			<FormInput
				name='firstName'
				placeholder='John'
				label='First Name'
				required
			/>,
			{
				useFormProps: {
					defaultValues: {
						firstName: '',
					},
					schema: z.object({
						firstName: z
							.string()
							.min(3, { message: 'Please enter at least 3 characters.' }),
					}),
				},
			},
		)

		await act(async () => {
			fireEvent.input(screen.getByTestId('input'), {
				target: { value: 'abcd' },
			})
		})

		expect(screen.getByTestId('input')).toHaveValue('abcd')

		await waitFor(() => {
			expect(
				screen.queryAllByText('Please enter at least 3 characters.'),
			).toHaveLength(0)
		})
	})
})

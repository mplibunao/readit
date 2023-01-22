import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Button, ButtonProps } from '../Button/Button'

export type FormButtonProps = ButtonProps

export const FormButton = ({ children, ...props }: FormButtonProps) => {
	const { formState } = useFormContext()

	return (
		<Button
			type='submit'
			{...props}
			disabled={!formState.isValid || props.disabled}
			loading={formState.isSubmitting}
		>
			{children}
		</Button>
	)
}

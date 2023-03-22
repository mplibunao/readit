import { DEBOUNCE_DELAY } from '@/constants'
import debounce from 'lodash-es/debounce'
import React from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'

import { CheckboxInput, CheckboxInputProps } from '../Input'

export interface FormCheckboxProps extends Omit<CheckboxInputProps, 'as'> {
	registerOptions?: RegisterOptions
	debounceDelay?: number
	name: string
}

export const FormCheckbox = React.forwardRef<
	HTMLInputElement,
	FormCheckboxProps
>(
	(
		{ registerOptions, name, debounceDelay = DEBOUNCE_DELAY, ...props },
		ref,
	): JSX.Element => {
		const { register, trigger, formState } = useFormContext()

		const {
			onChange,
			ref: hookFormRef,
			...rest
		} = register(name, registerOptions)

		const debouncedValidate = debounce(async () => {
			await trigger(name)
		}, debounceDelay)

		const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
			onChange(e)
			await debouncedValidate()
		}

		return (
			<CheckboxInput
				ref={mergeRefs([ref, hookFormRef])}
				{...rest}
				{...props}
				onChange={handleOnChange}
				isDirty={formState.isDirty}
			/>
		)
	},
)

FormCheckbox.displayName = 'FormCheckbox'

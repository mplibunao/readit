import { DEBOUNCE_DELAY } from '@/constants'
import debounce from 'lodash-es/debounce'
import React from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'

import { InputGroup, InputGroupProps } from '../Input/InputGroup'

export interface FormInputProps extends Omit<InputGroupProps, 'errors'> {
	registerOptions?: RegisterOptions
	debounceDelay?: number
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
	(
		{ name, label, registerOptions, debounceDelay = DEBOUNCE_DELAY, ...props },
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
			<InputGroup
				label={label}
				errors={formState.errors}
				ref={mergeRefs([ref, hookFormRef])}
				{...rest}
				{...props}
				onChange={handleOnChange}
				isDirty={formState.isDirty}
			/>
		)
	},
)
FormInput.displayName = 'FormInput'

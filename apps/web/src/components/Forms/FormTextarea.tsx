import { DEBOUNCE_DELAY } from '@/constants'
import debounce from 'lodash-es/debounce'
import React from 'react'
import { useFormContext, RegisterOptions } from 'react-hook-form'
import { mergeRefs } from 'react-merge-refs'

import { TextareaGroup, TextareaGroupProps } from '../Input'

export interface FormTextareaProps extends Omit<TextareaGroupProps, 'errors'> {
	registerOptions?: RegisterOptions
	debounceDelay?: number
}

export const FormTextarea = React.forwardRef<
	HTMLTextAreaElement,
	FormTextareaProps
>(
	(
		{ name, registerOptions, debounceDelay = DEBOUNCE_DELAY, ...props },
		ref,
	): JSX.Element => {
		const { register, formState, trigger } = useFormContext()

		const {
			onChange,
			ref: hookFormRef,
			...rest
		} = register(name, registerOptions)

		const debouncedValidate = debounce(async () => {
			await trigger(name)
		}, debounceDelay)

		const handleOnChange = async (
			e: React.ChangeEvent<HTMLTextAreaElement>,
		) => {
			onChange(e)
			await debouncedValidate()
		}

		return (
			<TextareaGroup
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

FormTextarea.displayName = 'FormTextarea'

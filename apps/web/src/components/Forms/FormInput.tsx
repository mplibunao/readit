import { DEBOUNCE_DELAY } from '@/constants'
import debounce from 'lodash-es/debounce'
import { useFormContext, RegisterOptions } from 'react-hook-form'

import { InputGroup, InputGroupProps } from '../Input/InputGroup'

export interface FormInputProps extends Omit<InputGroupProps, 'errors'> {
	registerOptions?: RegisterOptions
	debounceDelay?: number
}

export const FormInput = ({
	name,
	label,
	registerOptions,
	debounceDelay = DEBOUNCE_DELAY,
	...props
}: FormInputProps) => {
	const { register, trigger, formState } = useFormContext()

	const { onChange, ...rest } = register(name, registerOptions)

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
			{...rest}
			{...props}
			onChange={handleOnChange}
			isDirty={formState.isDirty}
		/>
	)
}

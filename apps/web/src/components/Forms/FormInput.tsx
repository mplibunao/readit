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

	const onChange = debounce(async () => {
		await trigger(name)
	}, debounceDelay)

	return (
		<InputGroup
			label={label}
			errors={formState.errors}
			{...register(name, registerOptions)}
			{...props}
			onChange={onChange}
		/>
	)
}

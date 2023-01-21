import debounce from 'lodash-es/debounce'
import { useFormContext, RegisterOptions } from 'react-hook-form'

import { InputGroup, InputGroupProps } from '../Input/InputGroup'

export type OmittedTypes = 'errors'

export interface FormInputProps extends Omit<InputGroupProps, OmittedTypes> {
	registerOptions?: RegisterOptions
}

export const FormInput = ({
	name,
	label,
	registerOptions,
	...props
}: FormInputProps) => {
	const {
		register,
		trigger,
		formState: { errors, isDirty },
	} = useFormContext()

	const onChange = debounce(async () => {
		await trigger(name)
	}, 500)

	return (
		<InputGroup
			label={label}
			errors={errors}
			isDirty={isDirty}
			{...register(name, registerOptions)}
			{...props}
			onChange={onChange}
		/>
	)
}

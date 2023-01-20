import { useFormContext, RegisterOptions } from 'react-hook-form'

import { InputGroup, InputGroupProps } from './InputGroup'

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
		formState: { errors, isDirty },
	} = useFormContext()

	return (
		<InputGroup
			label={label}
			errors={errors}
			isDirty={isDirty}
			{...register(name, registerOptions)}
			{...props}
		/>
	)
}

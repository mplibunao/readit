import {
	Control,
	FieldValues,
	Path,
	RegisterOptions,
	useController,
} from 'react-hook-form'

import { ErrorMessage } from '../Input'
import { BaseSelectOption, Select, SelectProps } from '../Input/Select'

type FormSelectProps<T extends FieldValues> = {
	helperText?: string
	control: Control<T>
	name: Path<T>
	rules?: Omit<
		RegisterOptions<T>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>
} & Omit<SelectProps<BaseSelectOption>, 'selected' | 'onChange'>

export const FormSelect = <T extends FieldValues>({
	control,
	name,
	rules,
	options,
	helperText,
	...props
}: FormSelectProps<T>): JSX.Element => {
	const {
		field: { value, onChange },
		fieldState: { error },
	} = useController({ control, name, rules })

	// Resolve the option from the value
	const optionCurrentlySelected =
		options.find((option) => option.value === value) || null

	return (
		<>
			<Select
				{...props}
				options={options}
				selected={optionCurrentlySelected}
				onChange={(option) => onChange(option?.value || null)}
			/>

			<ErrorMessage
				message={error?.message as string}
				helperText={helperText}
				id={`${name}-message`}
				fieldName={name}
			/>
		</>
	)
}

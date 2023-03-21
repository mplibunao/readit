import {
	Control,
	FieldValues,
	Path,
	RegisterOptions,
	useController,
} from 'react-hook-form'

import {
	ComboBox,
	ComboBoxProps,
	ErrorMessage,
	MultiItemComboBox,
	MultiItemComboBoxProps,
} from '../Input'

type FormComboBoxProps<T extends FieldValues> = {
	helperText?: string
	control: Control<T>
	name: Path<T>
	rules?: Omit<
		RegisterOptions<T>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>
} & Omit<ComboBoxProps, 'selected' | 'onChange'>

export const FormComboBox = <T extends FieldValues>({
	control,
	name,
	rules,
	options,
	helperText,
	...props
}: FormComboBoxProps<T>): JSX.Element => {
	const {
		field: { value, onChange },
		fieldState: { error },
	} = useController({ control, name, rules })

	// Resolve the option from the value
	const optionCurrentlySelected =
		options.find((option) => option.value === value) || null

	return (
		<>
			<ComboBox
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

type FormMultiComboBoxProps<T extends FieldValues> = {
	helperText?: string
	control: Control<T>
	name: Path<T>
	rules?: Omit<
		RegisterOptions<T>,
		'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
	>
} & Omit<MultiItemComboBoxProps, 'selected' | 'onChange'>

export const FormMultiComboBox = <T extends FieldValues>({
	control,
	name,
	rules,
	options,
	helperText,
	...props
}: FormMultiComboBoxProps<T>): JSX.Element => {
	const {
		field: { value, onChange },
		fieldState: { error },
	} = useController({ control, name, rules })

	// Resolve the option from the value
	const optionsCurrentlySelected = options.filter((option) =>
		value.includes(option.value),
	)

	return (
		<>
			<MultiItemComboBox
				{...props}
				options={options}
				selected={optionsCurrentlySelected}
				onChange={(options) => onChange(options.map((option) => option.value))}
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

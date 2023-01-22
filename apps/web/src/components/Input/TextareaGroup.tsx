import React, { useId } from 'react'
import { FieldErrors } from 'react-hook-form'

import ErrorMessage from './ErrorMessage'
import { Label } from './Label'
import { Textarea } from './Textarea'

export interface TextareaGroupProps
	extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'> {
	name: string
	label: string
	errors: FieldErrors
	helperText?: string
	cornerHint?: string
	classNames?: {
		input?: string
		label?: string
	}
	hideLabel?: boolean
}

export const TextareaGroup = React.forwardRef<
	HTMLTextAreaElement,
	TextareaGroupProps
>(
	(
		{
			name,
			label,
			errors,
			helperText,
			cornerHint,
			classNames = {},
			required = false,
			hideLabel = false,
			...props
		},
		ref,
	) => {
		const error = errors[name]
		const id = useId()

		return (
			<div role='group' data-testid='input-control'>
				<Label
					id={id}
					fieldName={name}
					label={label}
					hideLabel={hideLabel}
					className={classNames.label}
					showRequired={required}
					cornerHint={cornerHint}
				/>

				<div className={'mt-1 flex rounded-md shadow-sm'}>
					<div className='relative flex flex-grow items-stretch focus-within:z-10'>
						<Textarea
							name={name}
							id={id}
							ref={ref}
							required={required}
							isInvalid={!!error}
							withHelperText={!!helperText}
							withCornerHint={!!cornerHint}
							className={classNames.input}
							{...props}
						/>
					</div>
				</div>

				<ErrorMessage
					message={error?.message as string}
					helperText={helperText}
					id={id}
					fieldName={name}
				/>
			</div>
		)
	},
)

TextareaGroup.displayName = 'InputGroup'

export const textareaGroupDefaultProps: TextareaGroupProps = {
	name: 'email',
	label: 'Email',
	placeholder: 'Email your email',
	rows: 4,
	errors: {},
	hideLabel: false,
	disabled: false,
	helperText: undefined,
	cornerHint: undefined,
	classNames: {},
	required: false,
	readOnly: false,
}

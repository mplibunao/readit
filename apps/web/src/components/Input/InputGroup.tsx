import React, { useId } from 'react'
import { FieldErrors } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import ErrorMessage from './ErrorMessage'
import { Input } from './Input'
import { Label } from './Label'

export interface InputGroupProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color'> {
	name: string
	label: string
	errors: FieldErrors
	helperText?: string
	cornerHint?: string
	leftContent?: React.ReactNode
	leftContentClickable?: boolean
	rightContent?: React.ReactNode
	rightContentClickable?: boolean
	leftAddOn?: React.ReactNode
	rightAddOn?: React.ReactNode
	classNames?: {
		input?: string
		label?: string
		rightContent?: string
		leftContent?: string
		leftAddOn?: string
		rightAddOn?: string
	}
	hideLabel?: boolean
	isDirty?: boolean
}

export const InputGroup = React.memo(
	React.forwardRef<HTMLInputElement, InputGroupProps>(
		(
			{
				name,
				label,
				errors,
				helperText,
				cornerHint,
				leftContent,
				leftContentClickable = false,
				rightContent,
				rightContentClickable = false,
				leftAddOn,
				rightAddOn,
				classNames = {},
				required = false,
				hideLabel = false,
				isDirty: _isDirty,
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
							{leftAddOn && (
								<div
									className={twMerge(
										'relative -ml-px inline-flex items-center space-x-2 rounded-l-md border border-r-0 border-neutral-300 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus:border-primary-500 focus:outline-none  focus:ring-1 focus:ring-primary-500',
										classNames.leftAddOn,
									)}
								>
									{leftAddOn}
								</div>
							)}

							{leftContent && (
								<div
									className={twMerge(
										'absolute inset-y-0 left-0 flex items-center pl-3',
										leftContentClickable
											? 'pointer-events-auto'
											: 'pointer-events-none cursor-pointer',
										classNames.leftContent,
									)}
								>
									{leftContent}
								</div>
							)}

							<Input
								name={name}
								id={id}
								ref={ref}
								required={required}
								isInvalid={!!error}
								withHelperText={!!helperText}
								withCornerHint={!!cornerHint}
								className={twMerge(
									rightContent && 'pr-12',
									leftContent && 'pl-12',
									leftAddOn && 'rounded-l-none',
									classNames.input,
								)}
								{...props}
							/>

							{rightAddOn && (
								<div
									className={`relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 ${classNames.rightAddOn}`}
								>
									{rightAddOn}
								</div>
							)}

							{rightContent && (
								<div
									className={twMerge(
										'absolute inset-y-0 right-0 flex items-center pr-3',
										rightContentClickable
											? 'pointer-events-auto'
											: 'pointer-events-none cursor-pointer',
										classNames.rightContent,
									)}
								>
									{rightContent}
								</div>
							)}
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
	),
	(prevProps, nextProps) => prevProps.isDirty === nextProps.isDirty,
)

InputGroup.displayName = 'InputGroup'

export const inputGroupDefaultProps = {
	name: 'email',
	type: 'text',
	label: 'Email',
	placeholder: 'Email your email',
	errors: {},
	hideLabel: false,
	disabled: false,
	helperText: undefined,
	cornerHint: undefined,
	leftContent: undefined,
	rightContent: undefined,
	classNames: {},
	required: false,
	readOnly: false,
	rightContentClickable: false,
	leftContentClickable: false,
	leftAddOn: undefined,
	rightAddOn: undefined,
}

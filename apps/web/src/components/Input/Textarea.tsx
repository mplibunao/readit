import { cva, VariantProps } from 'cva'
import React from 'react'
import { twMerge } from 'tailwind-merge'

const textarea = cva(
	[
		'flex w-full flex-grow appearance-none',
		'rounded-md border px-3 py-2 shadow-sm',
		'focus:outline-none sm:text-sm',
	],
	{
		variants: {
			isInvalid: {
				true: 'border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500',
			},
			disabled: {
				true: 'disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-500',
			},
			color: {
				primary:
					'border-neutral-300 placeholder-neutral-400 focus:border-primary-500 focus:ring-primary-500',
			},
			defaultVariant: {
				color: 'primary',
			},
		},
	},
)

export interface TextareaProps
	extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'>,
		Omit<VariantProps<typeof textarea>, 'disabled'> {
	name: string
	id: string
	isInvalid?: boolean
	withHelperText?: boolean
	withCornerHint?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	(
		{
			id,
			name,
			color,
			className,
			disabled = false,
			readOnly = false,
			isInvalid = false,
			required = false,
			withHelperText = false,
			withCornerHint = false,
			...props
		},
		ref,
	): JSX.Element => {
		return (
			<textarea
				ref={ref}
				data-testid='textarea'
				name={name}
				id={`${id}-${name}-textarea`}
				disabled={disabled}
				readOnly={readOnly}
				aria-invalid={isInvalid ? 'true' : 'false'}
				aria-labelledby={`${id}-${name}-label`}
				aria-required={required}
				aria-readonly={readOnly}
				aria-describedby={twMerge(
					withHelperText && !isInvalid && `${id}-${name}-description`,
					isInvalid && `${id}-${name}-error`,
					withCornerHint && `${id}-${name}-hint`,
				)}
				className={textarea({
					color,
					disabled,
					isInvalid,
					class: twMerge(
						'flex w-full flex-grow appearance-none',
						'rounded-md border px-3 py-2 shadow-sm',
						'focus:outline-none sm:text-sm',
						className,
					),
				})}
				{...props}
			/>
		)
	},
)

Textarea.displayName = 'Textarea'
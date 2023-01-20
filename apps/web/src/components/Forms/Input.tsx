import { clsx } from '@/helpers/styles/clsx'
import { cva, cx, VariantProps } from 'cva'
import React from 'react'

const input = cva(
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

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'color'>,
		Omit<VariantProps<typeof input>, 'isInvalid' | 'disabled'> {
	name: string
	id: string
	isInvalid?: boolean
	withHelperText?: boolean
	withCornerHint?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			name,
			id,
			disabled = false,
			readOnly = false,
			isInvalid = false,
			required = false,
			withHelperText = false,
			withCornerHint = false,
			color,
			className,
			...props
		},
		ref,
	): JSX.Element => {
		return (
			<input
				data-testid='input'
				name={name}
				id={`${id}-${name}-input`}
				disabled={disabled}
				readOnly={readOnly}
				ref={ref}
				aria-invalid={isInvalid ? 'true' : 'false'}
				aria-labelledby={`${id}-${name}-label`}
				aria-required={required}
				aria-readonly={readOnly}
				aria-describedby={cx([
					clsx(withHelperText && !isInvalid, `${id}-${name}-description`),
					clsx(isInvalid, `${id}-${name}-error`),
					clsx(withCornerHint, `${id}-${name}-hint`),
				])}
				className={input({
					color,
					disabled,
					isInvalid,
					class: cx([
						'flex w-full flex-grow appearance-none',
						'rounded-md border px-3 py-2 shadow-sm',
						'focus:outline-none sm:text-sm',
						className,
					]),
				})}
				{...props}
			/>
		)
	},
)

Input.displayName = 'Input'

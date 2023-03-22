import { Button as AriaButton } from 'ariakit/button'
import { cva, VariantProps } from 'cva'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export const circularButton = cva(
	[
		'inline-flex items-center rounded-full border shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
	],
	{
		variants: {
			size: {
				xs: 'p-1',
				sm: 'p-1.5',
				md: 'p-2',
				lg: 'p-3',
			},
			color: {
				primary: 'focus:ring-primary-500',
				neutral: 'focus:ring-neutral-500',
				error: 'focus:ring-error-500',
			},
			intent: {
				primary: 'border-transparent text-white',
				secondary: 'border-trasparent',
				outline: 'bg-white',
				ghost: 'bg-transparent border-transparent',
			},
			disabled: {
				true: 'cursor-not-allowed opacity-60 shadow-none',
				false: '',
			},
			loading: {
				true: 'cursor-not-allowed opacity-60 shadow-none',
				false: '',
			},
		},
		compoundVariants: [
			{
				intent: 'primary',
				color: 'primary',
				class: 'bg-primary-600 hover:bg-primary-700',
			},
			{
				intent: 'primary',
				color: 'neutral',
				class: 'bg-neutral-600 hover:bg-neutral-700',
			},
			{
				intent: 'primary',
				color: 'error',
				class: 'bg-error-600 hover:bg-error-700',
			},
			{
				intent: 'secondary',
				color: 'primary',
				class: 'bg-primary-100 text-primary-700 hover:bg-primary-200',
			},
			{
				intent: 'secondary',
				color: 'neutral',
				class: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
			},
			{
				intent: 'secondary',
				color: 'error',
				class: 'bg-error-100 text-error-700 hover:bg-error-200',
			},
			{
				intent: 'outline',
				color: 'primary',
				class: 'border-primary-300 text-primary-700 hover:bg-primary-50',
			},
			{
				intent: 'outline',
				color: 'neutral',
				class: 'border-neutral-300 text-neutral-700 hover:bg-neutral-50',
			},
			{
				intent: 'outline',
				color: 'error',
				class: 'border-error-300 text-error-700 hover:bg-error-50',
			},
		],
		defaultVariants: {
			size: 'md',
			color: 'primary',
			intent: 'primary',
			disabled: false,
			loading: false,
		},
	},
)

export interface ButtonProps
	extends Omit<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			'color' | 'disabled'
		>,
		VariantProps<typeof circularButton> {
	children?: React.ReactNode
}

export const CircularButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			size,
			color,
			intent,
			loading,
			disabled = false,
			className,
			...props
		},
		forwardRef,
	): JSX.Element => {
		const isDisabled = Boolean(disabled || loading)
		return (
			<AriaButton
				className={twMerge(
					circularButton({
						size,
						color,
						intent,
						disabled: isDisabled,
						loading,
						className,
					}),
				)}
				disabled={isDisabled}
				ref={forwardRef}
				{...props}
			>
				{children}
			</AriaButton>
		)
	},
)
CircularButton.displayName = 'CircularButton'

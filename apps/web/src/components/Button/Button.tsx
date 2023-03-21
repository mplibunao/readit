import { Button as AriaButton } from 'ariakit/button'
import { cva, VariantProps } from 'cva'
import React from 'react'
import { twMerge } from 'tailwind-merge'

import { Spinner } from '../Spinner/Spinner'

export const button = cva(
	[
		'inline-flex items-center justify-center rounded',
		'border font-medium shadow-sm focus:outline-none',
		'focus:ring-2 focus:ring-offset-2',
	],
	{
		variants: {
			size: {
				xs: 'px-2.5 py-1.5 text-xs',
				sm: 'px-3 py-2 text-sm leading-4',
				md: 'px-4 py-2 text-sm',
				lg: 'px-4 py-2 text-base',
				xl: 'px-6 py-3 text-base',
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
		VariantProps<typeof button> {
	loadingText: string
	children?: React.ReactNode
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			size,
			color,
			intent,
			loading,
			loadingText,
			disabled = false,
			className,
			leftIcon,
			rightIcon,
			...props
		},
		forwardRef,
	): JSX.Element => {
		const isDisabled = Boolean(disabled || loading)
		return (
			<AriaButton
				className={twMerge(
					button({
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
				{leftIcon && !loading ? leftIcon : null}

				{loading && (
					<Spinner
						size='em'
						className={loadingText ? 'relative mr-2' : 'absolute mr-0'}
					/>
				)}

				{loading
					? loadingText || <span className='opacity-0'>{children}</span>
					: children}

				{rightIcon && !loading ? rightIcon : null}
			</AriaButton>
		)
	},
)
Button.displayName = 'Button'

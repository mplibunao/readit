import { Button as AriaButton } from 'ariakit/button'
import { cva, cx, VariantProps } from 'cva'

import { Spinner } from '../Spinner'

const button = cva(
	[
		'inline-flex items-center justify-center rounded',
		'border font-medium shadow-sm focus:outline-none',
		'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
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
				primary: '',
				neutral: '',
				error: '',
			},
			intent: {
				primary: 'border-transparent text-white',
				secondary: 'border-trasparent',
				outline: 'bg-white',
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

export const Button = ({
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
}: ButtonProps): JSX.Element => {
	return (
		<AriaButton
			className={button({
				size,
				color,
				intent,
				class: cx([className]),
			})}
			disabled={Boolean(disabled || loading)}
			{...props}
		>
			{leftIcon && !loading ? leftIcon : null}

			{loading && (
				<Spinner
					size='em'
					className={cx([loadingText ? 'relative mr-2' : 'absolute mr-0'])}
				/>
			)}

			{loading
				? loadingText || <span className='opacity-0'>{children}</span>
				: children}

			{rightIcon && !loading ? rightIcon : null}
		</AriaButton>
	)
}

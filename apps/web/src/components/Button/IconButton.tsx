import { Button as AriaButton } from 'ariakit/button'
import { VariantProps } from 'cva'
import { twMerge } from 'tailwind-merge'

import { button } from './Button'

export interface IconButtonProps
	extends Omit<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			'color' | 'disabled'
		>,
		VariantProps<typeof button> {
	children?: React.ReactNode
}

export const IconButton = ({
	color,
	intent = 'ghost',
	...props
}: IconButtonProps) => {
	const disabled = props.disabled ?? false
	const isDisabled = Boolean(disabled || props.loading)
	return (
		<AriaButton
			className={twMerge(
				button({
					size: props.size,
					color,
					intent,
					disabled: isDisabled,
					loading: props.loading,
				}),
				'p-0',
				props.className,
			)}
			{...props}
			disabled={isDisabled}
		>
			{props.loading ? (
				<span className='opacity-0'>{props.children}</span>
			) : (
				props.children
			)}
		</AriaButton>
	)
}

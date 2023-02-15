import { Button as AriaButton } from 'ariakit/button'
import { VariantProps } from 'cva'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'
import { IconProps } from '../Icon'
import { button } from './Button'

export interface IconButtonProps
	extends Omit<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			'color' | 'disabled' | 'id'
		>,
		VariantProps<typeof button>,
		IconProps {
	iconClass?: string
}

export const IconButton = ({
	color,
	intent = 'ghost',
	label,
	id,
	iconClass,
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
				<Icon id={id} label={label} className={iconClass} />
			)}
		</AriaButton>
	)
}

export type SpecificIconButtonProps = Omit<IconButtonProps, 'id' | 'label'>

export const CloseButton = ({
	size = 'xs',
	iconClass,
	...props
}: SpecificIconButtonProps) => {
	return (
		<IconButton
			className={twMerge(
				'rounded-md bg-white text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
				props.className,
			)}
			size={size}
			id='mini-x-mark'
			label='Close button'
			iconClass={twMerge('h-5 w-5', iconClass)}
			{...props}
		/>
	)
}

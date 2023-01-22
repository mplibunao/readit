import {
	Separator as Component,
	SeparatorProps as Props,
} from 'ariakit/separator'
import { twMerge } from 'tailwind-merge'

export type SeparatorProps = Props

export const Separator = ({
	className,
	...props
}: SeparatorProps): JSX.Element => {
	return (
		<Component
			className={twMerge('w-full border-t border-neutral-300', className)}
			{...props}
		/>
	)
}

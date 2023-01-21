import {
	Separator as Component,
	SeparatorProps as Props,
} from 'ariakit/Separator'
import { cx } from 'cva'

export type SeparatorProps = Props

export const Separator = ({
	className,
	...props
}: SeparatorProps): JSX.Element => {
	return (
		<Component
			className={cx(['w-full border-t border-neutral-300', className])}
			{...props}
		/>
	)
}

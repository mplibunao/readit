import { IconId } from './types'
import * as AccessibleIcon from '@radix-ui/react-accessible-icon'

export interface IconProps {
	className?: string
	id: IconId
	label: string
}

export const Icon = ({ id, label, ...props }: IconProps) => {
	return (
		<AccessibleIcon.Root label={label}>
			<svg {...props}>
				<use href={`/sprite.svg#${id}`} />
			</svg>
		</AccessibleIcon.Root>
	)
}

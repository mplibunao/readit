import { IconId } from './types'

type SvgProps = React.HTMLAttributes<SVGElement>

export interface IconProps {
	className?: string
	id: IconId
	label?: string
	hidden?: boolean
	role?: SvgProps['role']
	onClick?: SvgProps['onClick']
}

const isHidden = ({
	hidden,
	label,
	role,
}: Pick<IconProps, 'hidden' | 'label' | 'role'>) => {
	// hidden should take precedence over label since an icon can be not hidden but have no label (eg. have sibling elements that announce purpose)
	if (hidden) {
		return true
	}
	// role=img means standalone so don't hide it even if it has label
	if (role === 'img') {
		return false
	}
	if (label) {
		return true
	}
	return false
}

export const Icon = ({ id, label, hidden, ...props }: IconProps) => {
	const hideIcon = isHidden({ hidden, label, role: props.role })
	return (
		<>
			<svg aria-hidden={hideIcon} focusable={!hideIcon} {...props}>
				<use href={`/sprite.svg#${id}`} />
			</svg>
			{label ? <span className='sr-only'>{label}</span> : null}
		</>
	)
}

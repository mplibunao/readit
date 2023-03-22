import { twMerge } from 'tailwind-merge'

import { Icon, IconProps } from './Icon'

export const Logo = ({
	className,
	...props
}: Omit<IconProps, 'id'>): JSX.Element => {
	return (
		<Icon
			id='reddit'
			className={twMerge('h-12 w-auto text-primary-600', className)}
			label='logo'
			role='img'
			{...props}
		/>
	)
}

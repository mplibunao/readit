import { Story } from '@ladle/react'

import { Badge, BadgeProps } from './Badge'

export const Default: Story<BadgeProps> = (props) => {
	return (
		<div className='space-x-3 p-8'>
			<Badge color='primary' {...props}>
				Badge
			</Badge>
			<Badge color='neutral' {...props}>
				Badge
			</Badge>
			<Badge color='success' {...props}>
				Badge
			</Badge>
			<Badge color='warning' {...props}>
				Badge
			</Badge>
			<Badge color='error' {...props}>
				Badge
			</Badge>
			<Badge color='info' {...props}>
				Badge
			</Badge>
		</div>
	)
}

Default.argTypes = {
	size: {
		options: ['sm', 'md'],
		control: { type: 'radio' },
		defaultValue: 'sm',
	},
	rounded: {
		options: ['pill', 'rounded'],
		control: { type: 'radio' },
		defaultValue: 'pill',
	},
}

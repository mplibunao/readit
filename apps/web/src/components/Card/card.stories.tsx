import { Story } from '@ladle/react'

import { Card, CardProps } from './Card'

export const Default: Story<CardProps> = (props) => {
	return (
		<div className='h-32'>
			<Card {...props} />
		</div>
	)
}

Default.args = {
	className: 'min-h-full',
}

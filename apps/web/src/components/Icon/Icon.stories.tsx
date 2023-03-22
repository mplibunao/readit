import { Story } from '@ladle/react'

import { Icon } from './Icon'

export const Logo: Story = () => {
	return (
		<Icon
			id='reddit'
			label='Logo'
			className='h-[1024px] w-[1024px] text-primary-600'
		/>
	)
}

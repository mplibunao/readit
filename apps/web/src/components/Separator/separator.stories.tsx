import { Story } from '@ladle/react'

import { Separator, SeparatorProps } from '.'

export const Horizontal: Story<SeparatorProps> = (props) => {
	return <Separator {...props} />
}

export const WithTextHorizontal: Story<SeparatorProps> = (props) => {
	return (
		<div className='relative'>
			<div className='absolute inset-0 flex items-center'>
				<Separator {...props} />
			</div>
			<div className='relative flex justify-center text-sm'>
				<span className='bg-white px-2 text-neutral-500'>Or continue with</span>
			</div>
		</div>
	)
}

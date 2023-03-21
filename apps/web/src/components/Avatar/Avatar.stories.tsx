import { Story } from '@ladle/react'

import { Avatar, AvatarProps } from './Avatar'

export const Image: Story<AvatarProps> = (args) => {
	return (
		<div className='flex flex-wrap w-full p-8 space-x-4'>
			<Avatar {...args} size='xs' />
			<Avatar {...args} size='sm' />
			<Avatar {...args} size='md' />
			<Avatar {...args} size='lg' />
			<Avatar {...args} size='xl' />
		</div>
	)
}

Image.args = {
	src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	name: 'Mark Paolo',
}

export const Initials: Story<AvatarProps> = (args) => {
	return (
		<div className='flex flex-wrap w-full p-8 space-x-4'>
			<Avatar {...args} size='xs' />
			<Avatar {...args} size='sm' />
			<Avatar {...args} size='md' />
			<Avatar {...args} size='lg' />
			<Avatar {...args} size='xl' />
		</div>
	)
}

Initials.args = {
	name: 'Mark Paolo',
}
Initials.argTypes = {
	color: {
		options: ['darkGray', 'lightGray'],
		control: { type: 'radio' },
		defaultValue: 'darkGray',
	},
}

import type { Story } from '@ladle/react'

import { Button, ButtonProps } from '.'
import { Icon } from '../Icon'

const buttonDefaultProps = {
	size: 'md',
	loading: false,
	loadingText: 'Loading...',
	intent: 'primary',
	color: 'primary',
	children: 'Button',
	disabled: false,
	LeftIcon: undefined,
	RightIcon: undefined,
}

const buttonArgTypes = {
	size: {
		options: ['xs', 'sm', 'md', 'lg', 'xl'],
		control: { type: 'radio' },
		defaultValue: 'md',
	},
	variant: {
		options: ['primary', 'secondary', 'outline'],
		control: { type: 'radio' },
		defaultValue: 'primary',
	},
	color: {
		options: ['primary', 'neutral', 'error'],
		control: { type: 'radio' },
		defaultValue: 'primary',
	},
}

export const Default: Story<ButtonProps> = (props) => {
	return (
		<div className='space-x-3 p-8'>
			<Button {...props} size='xs'>
				Button
			</Button>
			<Button {...props} size='sm'>
				Button
			</Button>
			<Button {...props} size='md'>
				Button
			</Button>
			<Button {...props} size='lg'>
				Button
			</Button>
			<Button {...props} size='xl'>
				Button
			</Button>
		</div>
	)
}
Default.args = {
	...buttonDefaultProps,
}
Default.argTypes = buttonArgTypes

export const IntentsAndColor: Story<ButtonProps> = (props) => {
	const intents = ['primary', 'secondary', 'outline'] as const
	const colors = ['primary', 'neutral', 'error'] as const
	return (
		<div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8'>
			{colors.map((color) => {
				return intents.map((intent) => {
					return (
						<Button
							{...props}
							key={`${color}-${intent}`}
							intent={intent}
							color={color}
						>
							{intent} {color}
						</Button>
					)
				})
			})}
		</div>
	)
}

IntentsAndColor.args = {
	...buttonDefaultProps,
}
IntentsAndColor.argTypes = buttonArgTypes

export const Disabled = Default.bind({})
Disabled.args = {
	...buttonDefaultProps,
	disabled: true,
}

export const Loading = Default.bind({})
Loading.args = {
	...buttonDefaultProps,
	loading: true,
}

export const LoadingNoText = Default.bind({})
LoadingNoText.args = {
	...buttonDefaultProps,
	loading: true,
	loadingText: undefined,
}

export const LeftIcon = Default.bind({})
LeftIcon.args = {
	...buttonDefaultProps,
	leftIcon: <Icon id='eye' label='See' className='mr-1 h-6 w-6' />,
}

export const RightIcon = Default.bind({})
RightIcon.args = {
	...buttonDefaultProps,
	rightIcon: <Icon id='eye' label='See' className='ml-1 h-6 w-6' />,
}

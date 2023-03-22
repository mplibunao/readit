import type { Story } from '@ladle/react'

import { Spinner, SpinnerProps } from './Spinner'

const defaultProps: SpinnerProps = {
	size: 'md',
	label: 'Loading...',
}

const argTypes = {
	size: {
		options: ['xs', 'sm', 'md', 'lg', 'xl', 'em'],
		control: { type: 'radio' },
		defaultValue: 'em',
	},
	color: {
		options: ['primary', 'neutral', 'success', 'warning', 'error', 'info'],
		control: { type: 'radio' },
		defaultValue: 'primary',
	},
	stroke: {
		options: ['visible', 'transparent'],
		control: { type: 'radio' },
	},
}

export const Default: Story<SpinnerProps> = (props) => {
	return <Spinner {...props} />
}

Default.args = defaultProps
Default.argTypes = argTypes

export const Sizes: Story<SpinnerProps> = (props) => {
	return (
		<div className='flex items-center space-x-2'>
			<Spinner {...props} size='xs' />
			<Spinner {...props} size='sm' />
			<Spinner {...props} size='md' />
			<Spinner {...props} size='lg' />
			<Spinner {...props} size='xl' />
			<Spinner {...props} size='em' />
		</div>
	)
}
Sizes.args = defaultProps
Sizes.argTypes = argTypes

export const TransparentStroke = Sizes.bind({})
TransparentStroke.args = {
	...defaultProps,
	stroke: 'transparent',
}

export const Colors: Story<SpinnerProps> = (props) => {
	return (
		<div className='flex items-center space-x-2'>
			<Spinner {...props} color='primary' />
			<Spinner {...props} color='info' />
			<Spinner {...props} color='error' />
			<Spinner {...props} color='warning' />
			<Spinner {...props} color='success' />
			<Spinner {...props} color='neutral' />
		</div>
	)
}

Colors.args = defaultProps
Colors.argTypes = argTypes

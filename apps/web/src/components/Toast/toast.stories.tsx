import { Story } from '@ladle/react'
import { toast, Toaster } from 'react-hot-toast'

import { Button } from '../Button/Button'
import { ErrorToast, SuccessToast, ToastProps } from './Toast'

const defaultProps = {
	title: 'Toast created',
	message: 'Nice toast successfully created',
	duration: 5000,
}

const ArgTypes = {
	size: {
		options: ['xs', 'sm', 'md', 'lg', 'xl'],
		control: { type: 'radio' },
		defaultValue: 'sm',
	},
	position: {
		options: [
			'top-left',
			'top-center',
			'top-right',
			'bottom-left',
			'bottom-center',
			'bottom-right',
		],
		control: { type: 'radio' },
		defaultValue: 'top-right',
	},
}

interface ToastStoryProps extends ToastProps {
	position:
		| 'top-left'
		| 'top-center'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-center'
		| 'bottom-right'
	duration: number
}

export const Success: Story<ToastStoryProps> = ({
	position,
	duration,
	...props
}) => {
	const action = () => {
		toast.custom((t) => <SuccessToast {...props} toast={t} />)
	}
	return (
		<>
			<Button onClick={action} loadingText='Toasting'>
				Success toast
			</Button>
			<Toaster
				position={position}
				toastOptions={{
					duration,
				}}
			/>
		</>
	)
}

Success.args = {
	...defaultProps,
}
Success.argTypes = ArgTypes

export const Error: Story<ToastStoryProps> = ({
	position,
	duration,
	...props
}) => {
	const action = () => {
		toast.custom((t) => <ErrorToast {...props} toast={t} />)
	}
	return (
		<>
			<Button onClick={action} loadingText='Toasting'>
				Error toast
			</Button>
			<Toaster
				position={position}
				toastOptions={{
					duration,
				}}
			/>
		</>
	)
}

Error.args = {
	...defaultProps,
}
Error.argTypes = ArgTypes

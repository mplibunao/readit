import type { Story } from '@ladle/react'
import * as Toggle from '@radix-ui/react-toggle'
import React from 'react'
import { FieldError } from 'react-hook-form'

import { Icon } from '../../Icon'
import {
	InputGroup,
	inputGroupDefaultProps,
	InputGroupProps,
} from '../InputGroup'

export const Default: Story<InputGroupProps> = (props) => {
	return <InputGroup {...props} />
}

Default.args = {
	...inputGroupDefaultProps,
}

export const Error = Default.bind({})

Error.args = {
	...inputGroupDefaultProps,
	errors: {
		email: {
			message: 'Invalid email',
		} as FieldError,
	},
}

export const Disabled = Default.bind({})

Disabled.args = {
	...inputGroupDefaultProps,
	disabled: true,
}

export const HelperText = Default.bind({})

HelperText.args = {
	...inputGroupDefaultProps,
	helperText: 'This is a helper text',
}

export const CornerHint = Default.bind({})

CornerHint.args = {
	...inputGroupDefaultProps,
	cornerHint: 'Optional',
}

export const LeftRightContent = Default.bind({})

LeftRightContent.args = {
	...inputGroupDefaultProps,
	name: 'price',
	label: 'Price',
	placeholder: '0.00',
	leftContent: <span className='text-neutral-500 sm:text-sm'>$</span>,
	rightContent: <span className='pr-3 text-neutral-500 sm:text-sm'>USD</span>,
	classNames: {
		input: 'pl-6',
	},
}

export const LeftContent = Default.bind({})

LeftContent.args = {
	...inputGroupDefaultProps,
	name: 'website',
	label: 'Company Website',
	placeholder: 'www.example.com',
	leftContent: (
		<span className='mr-1 text-neutral-500 sm:text-sm'>http://</span>
	),
	classNames: {
		input: 'pl-16 ml-1',
	},
}

export const RightContentIconError = Default.bind({})

RightContentIconError.args = {
	...inputGroupDefaultProps,
	name: 'account-number',
	label: 'Account Number',
	placeholder: '000-00-0000',
	rightContent: (
		<Icon
			className='mr-2 h-5 w-5 text-neutral-400'
			id='eye'
			label='some-icon'
		/>
	),
	errors: { 'account-number': { message: 'hhelo' } },
}

export const RightContentSelect = Default.bind({})

RightContentSelect.args = {
	...inputGroupDefaultProps,
	classNames: {
		rightContent: 'pr-0',
	},
	rightContentClickable: true,
	rightContent: (
		<>
			<label htmlFor='currency' className='sr-only'>
				Currency
			</label>
			<select
				id='currency'
				name='currency'
				className='h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
			>
				<option>USD</option>
				<option>CAD</option>
				<option>EUR</option>
			</select>
		</>
	),
}

export const Required = Default.bind({})

Required.args = {
	...inputGroupDefaultProps,
	required: true,
}

export const RightAddOn = Default.bind({})

RightAddOn.args = {
	...inputGroupDefaultProps,
	rightAddOn: (
		<>
			<Icon
				id='eye-slash'
				label='hide password'
				className='h-5 w-5 text-neutral-400'
			/>
			<span>Sort</span>
		</>
	),
}

export const RightAddOnWithA11y = Default.bind({})

RightAddOnWithA11y.args = {
	...inputGroupDefaultProps,
	rightContent: (
		<button className='inline-flex h-full w-full items-center justify-between rounded-r-md border border-neutral-300 bg-neutral-50 px-4 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500'>
			<Icon
				id='eye-slash'
				label='hide password'
				className='mr-1 h-5 w-5 text-neutral-400'
			/>
			<span>Sort</span>
		</button>
	),
	classNames: {
		rightContent: 'w-24 pr-0 pl-3',
	},
}

export const ToggleRightContentButton: Story<InputGroupProps> = (props) => {
	return <InputGroup {...props} />
}

ToggleRightContentButton.args = {
	...inputGroupDefaultProps,
	name: 'account-number',
	label: 'Account Number',
	placeholder: '000-00-0000',
	rightContentClickable: true,
	rightContent: (
		<button className='inline-flex items-center rounded border border-transparent bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
			Hide
		</button>
	),
}

export const LeftAddOn = Default.bind({})

LeftAddOn.args = {
	...inputGroupDefaultProps,
	leftAddOn: <span>http://</span>,
}

export const ToggleLeftContentIcon: Story<InputGroupProps> = (props) => {
	const [showPassword, setShowPassword] = React.useState(false)
	return (
		<InputGroup
			{...props}
			leftContent={
				<Toggle.Root
					aria-label='Toggle show password'
					pressed={showPassword}
					onPressedChange={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? (
						<Icon
							id='eye-slash'
							label='hide password'
							className='mr-3 h-5 w-5 text-neutral-400'
						/>
					) : (
						<Icon
							id='eye'
							label='show password'
							className='mr-3 h-5 w-5 text-neutral-400'
						/>
					)}
				</Toggle.Root>
			}
		/>
	)
}

ToggleLeftContentIcon.args = {
	...inputGroupDefaultProps,
	name: 'account-number',
	label: 'Account Number',
	placeholder: '000-00-0000',
	leftContentClickable: true,
}

export const ToggleRightContentIcon: Story<InputGroupProps> = (props) => {
	const [showPassword, setShowPassword] = React.useState(false)
	return (
		<InputGroup
			{...props}
			rightContent={
				<Toggle.Root
					aria-label='Toggle show password'
					pressed={showPassword}
					onPressedChange={() => setShowPassword((prev) => !prev)}
				>
					{showPassword ? (
						<Icon
							id='eye-slash'
							label='hide password'
							className='mr-3 h-5 w-5 text-neutral-400'
						/>
					) : (
						<Icon
							id='eye'
							label='show password'
							className='mr-3 h-5 w-5 text-neutral-400'
						/>
					)}
				</Toggle.Root>
			}
		/>
	)
}

ToggleRightContentIcon.args = {
	...inputGroupDefaultProps,
	name: 'account-number',
	label: 'Account Number',
	placeholder: '000-00-0000',
	rightContentClickable: true,
}

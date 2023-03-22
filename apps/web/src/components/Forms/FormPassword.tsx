import * as Toggle from '@radix-ui/react-toggle'
import React from 'react'

import { Icon } from '../Icon'
import { FormInput, FormInputProps } from './FormInput'

export interface FormPasswordProps extends FormInputProps {
	ariaLabelName?: string
	allowShowPassword?: boolean
}

export const FormPassword = React.forwardRef<
	HTMLInputElement,
	FormPasswordProps
>(
	(
		{
			placeholder = '8+ characters, upper/lowercase, numbers',
			label = 'Password',
			ariaLabelName = 'password',
			classNames,
			allowShowPassword,
			...props
		},
		ref,
	): JSX.Element => {
		const [showPassword, setShowPassword] = React.useState(false)
		return (
			<FormInput
				placeholder={placeholder}
				label={label}
				ref={ref}
				type={showPassword ? 'text' : 'password'}
				autoComplete='current-password'
				classNames={{ rightContent: 'pointer-events-auto', ...classNames }}
				rightContent={
					allowShowPassword ? (
						<Toggle.Root
							aria-label={`Toggle show ${ariaLabelName}`}
							pressed={showPassword}
							onPressedChange={() => setShowPassword((prev) => !prev)}
						>
							{showPassword ? (
								<Icon
									id='eye-slash'
									label={`hide ${ariaLabelName}`}
									className='mr-3 h-5 w-5 text-neutral-400'
									role='img'
								/>
							) : (
								<Icon
									id='eye'
									label={`show ${ariaLabelName}`}
									className='mr-3 h-5 w-5 text-neutral-400'
									role='img'
								/>
							)}
						</Toggle.Root>
					) : null
				}
				{...props}
			/>
		)
	},
)

FormPassword.displayName = 'FormPassword'

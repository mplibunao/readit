import type { Story } from '@ladle/react'
import { FieldError } from 'react-hook-form'

import {
	TextareaGroupProps,
	TextareaGroup,
	textareaGroupDefaultProps,
} from '../TextareaGroup'

export const Default: Story<TextareaGroupProps> = (props) => {
	return <TextareaGroup {...props} />
}
Default.args = {
	...textareaGroupDefaultProps,
}

export const Error = Default.bind({})
Error.args = {
	...textareaGroupDefaultProps,
	errors: {
		email: {
			message: 'Invalid email',
		} as FieldError,
	},
}

export const Disabled = Default.bind({})
Disabled.args = {
	...textareaGroupDefaultProps,
	disabled: true,
}

export const HelperText = Default.bind({})
HelperText.args = {
	...textareaGroupDefaultProps,
	helperText: 'This is a helper text',
}

export const CornerHint = Default.bind({})
CornerHint.args = {
	...textareaGroupDefaultProps,
	cornerHint: 'Optional',
}

export const Required = Default.bind({})
Required.args = {
	...textareaGroupDefaultProps,
	required: true,
}

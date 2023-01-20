import { Icon } from '../Icon'

export interface ErrorMessageProps {
	message?: string | undefined
	helperText?: string
	id: string
	fieldName: string
}

export const ErrorMessage = ({
	message,
	helperText,
	id,
	fieldName: name,
}: ErrorMessageProps): JSX.Element => {
	return message ? (
		<div className='mt-2 flex flex-row items-center'>
			<Icon
				id='exclamation-cicle'
				className='h-5 w-5 text-error-500'
				data-testid='input-error-icon'
				label='Error'
			/>
			<p
				role='alert'
				className='ml-2 text-sm text-error-600'
				id={`${id}-${name}-error`}
				data-testid='input-error-message'
				aria-live='polite'
			>
				{message}
			</p>
		</div>
	) : (
		<p
			className='mt-2 text-sm text-neutral-500'
			data-testid='input-helper-text'
			id={`${id}-${name}-description`}
		>
			{helperText}
		</p>
	)
}

export default ErrorMessage

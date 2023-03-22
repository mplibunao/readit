import React, { useId } from 'react'

export interface CheckboxGroupProps {
	label?: string
	srOnlyLabel?: string
	children: React.ReactNode
	className?: string
}

export const CheckboxGroup = ({
	label,
	srOnlyLabel,
	children,
	className,
}: CheckboxGroupProps): JSX.Element => {
	return (
		<fieldset className={className}>
			{srOnlyLabel ? <legend className='sr-only'>By Email</legend> : null}
			{label ? (
				<div className='text-sm font-semibold leading-6 text-neutral-900'>
					{label}
				</div>
			) : null}

			{children}
		</fieldset>
	)
}

export interface CheckboxInputProps
	extends React.HTMLAttributes<HTMLInputElement> {
	label: string
	description?: string
	children?: React.ReactNode
	isDirty?: boolean
	name: string
}

export const CheckboxInput = React.memo(
	React.forwardRef<HTMLInputElement, CheckboxInputProps>(
		({ label, name, description, children, isDirty: _, ...props }, ref) => {
			const id = useId()
			return (
				<div className='relative flex items-start'>
					<div className='flex h-6 items-center'>
						<input
							id={`${id}-${name}`}
							name={name}
							type='checkbox'
							className='h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-600'
							ref={ref}
							{...props}
						/>
					</div>
					<div className='ml-3'>
						<label
							htmlFor={`${id}-${name}`}
							className='text-sm font-medium leading-6 text-neutral-900'
						>
							{children}
							{label}
						</label>

						{description ? (
							<p className='text-sm text-neutral-500'>{description}</p>
						) : null}
					</div>
				</div>
			)
		},
	),
	(prevProps, nextProps) => prevProps.isDirty === nextProps.isDirty,
)

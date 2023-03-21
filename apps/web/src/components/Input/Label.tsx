import { twMerge } from 'tailwind-merge'

export interface LabelProps
	extends React.LabelHTMLAttributes<HTMLLabelElement> {
	id: string
	fieldName: string
	hideLabel?: boolean
	label: string
	showRequired?: boolean
	cornerHint?: string
}

export const Label = ({
	id,
	fieldName: name,
	label,
	hideLabel,
	className,
	showRequired,
	cornerHint,
}: LabelProps): JSX.Element => {
	return (
		<div className='flex justify-between'>
			<label
				id={`${id}-${name}-label`}
				htmlFor={`${id}-${name}`}
				className={twMerge(
					'block text-sm font-medium text-neutral-700',
					hideLabel && 'sr-only',
					className,
				)}
			>
				{label}

				{showRequired && (
					<span
						role='presentation'
						aria-hidden='true'
						className='ml-1 text-base font-normal text-error-500'
					>
						*
					</span>
				)}
			</label>

			{cornerHint && (
				<span
					className='text-sm italic text-neutral-500'
					data-testid='input-corner-hint'
					id={`${id}-${name}-hint`}
				>
					{cornerHint}
				</span>
			)}
		</div>
	)
}

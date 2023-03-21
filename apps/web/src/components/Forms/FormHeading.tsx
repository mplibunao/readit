export interface FormHeadingProps {
	title: string
	subtitle?: string
}

export const FormHeading = ({
	title,
	subtitle,
}: FormHeadingProps): JSX.Element => {
	return (
		<>
			<h3 className='text-base font-semibold leading-6 text-neutral-900'>
				{title}
			</h3>
			<p className='max-w-2xl text-sm text-neutral-500'>{subtitle}</p>
		</>
	)
}

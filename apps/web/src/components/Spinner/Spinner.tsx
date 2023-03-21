import { cva, VariantProps } from 'cva'
import { twMerge } from 'tailwind-merge'

export interface SpinnerProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'color'>,
		VariantProps<typeof spinner> {
	label?: string
}

const spinner = cva(
	['inline-block animate-spin rounded-full border-solid border-current'],
	{
		variants: {
			size: {
				xs: 'h-3 w-3',
				sm: 'h-3.5 w-3.5',
				md: 'h-5 w-5',
				lg: 'h-7 w-7',
				xl: 'h-11 w-11',
				em: 'h-[1em] w-[1em]',
			},
			stroke: {
				transparent: 'border-l-transparent',
				visible: '',
			},
			color: {
				primary: 'text-primary-800',
				neutral: 'text-neutral-800',
				success: 'text-success-800',
				warning: 'text-warning-800',
				error: 'text-error-800',
				info: 'text-info-800',
			},
			thickness: {
				sm: 'border-[1.5px]',
				md: 'border-2',
				lg: 'border-4',
			},
		},
		compoundVariants: [
			{
				stroke: 'visible',
				color: 'primary',
				class: 'border-b-primary-400 border-l-primary-400',
			},
			{
				stroke: 'visible',
				color: 'neutral',
				class: 'border-b-neutral-400 border-l-neutral-400',
			},
			{
				stroke: 'visible',
				color: 'success',
				class: 'border-b-success-400 border-l-success-400',
			},
			{
				stroke: 'visible',
				color: 'warning',
				class: 'border-b-warning-400 border-l-warning-400',
			},
			{
				stroke: 'visible',
				color: 'error',
				class: 'border-b-error-400 border-l-error-400',
			},
			{
				stroke: 'visible',
				color: 'info',
				class: 'border-b-info-400 border-l-info-400',
			},
		],
		defaultVariants: {
			size: 'md',
			stroke: 'transparent',
			color: 'primary',
			thickness: 'md',
		},
	},
)

export const Spinner = ({
	size,
	className,
	label = 'Loading...',
	stroke,
	color,
	thickness,
}: SpinnerProps): JSX.Element => {
	return (
		<div
			className={twMerge(
				spinner({
					size,
					stroke,
					color,
					className,
					thickness,
				}),
			)}
		>
			<span className='sr-only'>{label}</span>
		</div>
	)
}

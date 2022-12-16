import { cva, VariantProps } from 'cva'

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
				xs: 'h-3 w-3 border-[2px]',
				sm: 'h-3.5 w-3.5 border-[2px]',
				md: 'h-5 w-5 border-[2px]',
				lg: 'h-7 w-7 border-[2px]',
				xl: 'h-11 w-11 border-[2px]',
				em: 'h-[1em] w-[1em] border-[1.5px]',
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
			stroke: 'visible',
			color: 'primary',
		},
	}
)

export const Spinner = ({
	size,
	className,
	label = 'Loading...',
	stroke,
	color,
}: SpinnerProps): JSX.Element => {
	return (
		<div
			className={spinner({
				size,
				stroke,
				color,
				class: className,
			})}
		>
			<span className='sr-only'>{label}</span>
		</div>
	)
}

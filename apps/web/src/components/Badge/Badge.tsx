import { cva, VariantProps } from 'cva'
import { twMerge } from 'tailwind-merge'

export function getColor(name: string): BadgeProps['color'] {
	const classNames = [
		'primary',
		'neutral',
		'success',
		'warning',
		'error',
		'info',
	]
	const hash = name.split('').reduce((acc, char) => {
		return acc + char.charCodeAt(0)
	}, 0)
	const index = hash % classNames.length
	return classNames[index] as BadgeProps['color']
}

export const badge = cva(
	[
		'inline-flex items-center bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800',
	],
	{
		variants: {
			clickable: {
				true: 'cursor-pointer',
			},
			size: {
				sm: 'px-2.5 py-0.5 text-xs',
				md: 'px-3 py-0.5 text-sm',
			},
			rounded: {
				pill: 'rounded-full',
				rounded: 'rounded',
			},
			color: {
				primary: 'bg-primary-100 text-primary-800',
				neutral: 'bg-neutral-100 text-neutral-800',
				success: 'bg-success-100 text-success-800',
				warning: 'bg-warning-100 text-warning-800',
				error: 'bg-error-100 text-error-800',
				info: 'bg-info-100 text-info-800',
			},
		},
		defaultVariants: {
			size: 'sm',
			rounded: 'pill',
			color: 'primary',
			clickable: false,
		},
		compoundVariants: [
			{ clickable: true, color: 'primary', class: 'hover:bg-primary-200' },
			{ clickable: true, color: 'neutral', class: 'hover:bg-neutral-200' },
			{ clickable: true, color: 'success', class: 'hover:bg-success-200' },
			{ clickable: true, color: 'warning', class: 'hover:bg-warning-200' },
			{ clickable: true, color: 'error', class: 'hover:bg-error-200' },
			{ clickable: true, color: 'info', class: 'hover:bg-info-200' },
		],
	},
)

export type BadgeProps = VariantProps<typeof badge> & {
	children: React.ReactNode
	className?: string
}

export const Badge = ({
	children,
	className,
	color,
	rounded,
	size,
	clickable,
}: BadgeProps): JSX.Element => {
	return (
		<span
			className={twMerge(
				badge({
					color,
					rounded,
					size,
					clickable,
				}),
				className,
			)}
		>
			{children}
		</span>
	)
}

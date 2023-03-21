import { cva, VariantProps } from 'cva'
import { twMerge } from 'tailwind-merge'

import { CloseButton } from '../Button'

const bannerWrapper = cva(
	['flex items-center gap-x-6 py-2.5 px-6 sm:px-3.5 sm:before:flex-1'],
	{
		variants: {
			color: {
				dark: 'bg-neutral-900',
				primary: 'bg-primary-600',
			},
		},
		defaultVariants: {
			color: 'dark',
		},
	},
)

export interface BannerProps extends VariantProps<typeof bannerWrapper> {
	children: React.ReactNode
	onClose: () => void
	className?: string
}

export const Banner = ({
	children,
	onClose,
	color,
	className,
}: BannerProps): JSX.Element => {
	return (
		<div className={twMerge(bannerWrapper({ color, className }))}>
			<p className='text-sm leading-6 text-white'>{children}</p>
			<div className='flex flex-1 justify-end'>
				<CloseButton
					onClick={onClose}
					className='-m-3 p-3 focus-visible:outline-offset-[-4px]'
					iconClass='text-white'
				/>
			</div>
		</div>
	)
}

export interface BannerContentProps {
	title: string
	description: string
}

export const BannerContent = ({
	title,
	description,
}: BannerContentProps): JSX.Element => {
	return (
		<>
			<strong className='font-semibold'>{title}</strong>
			<Circle />
			{description}&nbsp;
			<span aria-hidden='true'>&rarr;</span>
		</>
	)
}

export const Circle = ({ className }: { className?: string }) => (
	<svg
		viewBox='0 0 2 2'
		className={twMerge('mx-2 inline h-0.5 w-0.5 fill-current', className)}
		aria-hidden='true'
		focusable={false}
	>
		<circle cx={1} cy={1} r={1} />
	</svg>
)

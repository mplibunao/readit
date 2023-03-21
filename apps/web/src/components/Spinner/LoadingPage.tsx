import { cva, VariantProps } from 'cva'
import { twMerge } from 'tailwind-merge'

import { Spinner } from './Spinner'

const loadingPage = cva(['flex items-center justify-center'], {
	variants: {
		height: {
			full: 'min-h-full',
			header: 'min-h-header',
			body: 'min-h-body',
		},
	},
	defaultVariants: { height: 'body' },
})

type LoadingPageProps = VariantProps<typeof loadingPage> & {
	className?: string
}

export const LoadingPage = ({
	className,
	height,
}: LoadingPageProps): JSX.Element => {
	return (
		<div
			className={twMerge(
				'flex items-center justify-center',
				loadingPage({ height, className }),
			)}
		>
			<Spinner size='xl' thickness='lg' />
		</div>
	)
}

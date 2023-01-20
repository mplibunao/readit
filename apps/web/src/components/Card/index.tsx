import { cx } from 'cva'

export interface CardProps {
	children?: React.ReactNode
	className?: string
}

export const Card = ({ children, className }: CardProps): JSX.Element => {
	return (
		<div
			className={cx([
				'bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10',
				className,
			])}
		>
			{children}
		</div>
	)
}

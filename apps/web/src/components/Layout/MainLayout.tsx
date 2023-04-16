import { twMerge } from 'tailwind-merge'

export interface MainLayoutProps {
	children: React.ReactNode
	bgClass?: string
}

export const MainLayout = ({
	children,
	bgClass,
}: MainLayoutProps): JSX.Element => {
	return (
		<div className={twMerge('bg-neutral-50', bgClass)}>
			<div className='mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0'>
				<main className='flex-1'>
					<div className='relative mx-auto max-w-4xl md:px-8 xl:px-0 py-10'>
						{children}
					</div>
				</main>
			</div>
		</div>
	)
}

export const FullWidthLayout = ({ children }: MainLayoutProps): JSX.Element => {
	return (
		<div className='relative z-0 flex flex-1 overflow-hidden'>
			<main className='relative z-0 flex-1 overflow-y-auto focus:outline-none xl:order-last'>
				{children}
			</main>
		</div>
	)
}

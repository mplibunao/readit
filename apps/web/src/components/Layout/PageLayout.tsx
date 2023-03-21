export interface BasicLayoutProps {
	children: React.ReactNode
}

export const PageLayout = ({ children }: BasicLayoutProps): JSX.Element => {
	return <div className='min-h-full h-full'>{children}</div>
}

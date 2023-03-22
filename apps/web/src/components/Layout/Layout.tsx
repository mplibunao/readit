import { Navbar } from '../Navbar'
import { MobileSidebar, Sidebar } from '../Sidebar'

export interface LayoutProps {
	children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
	return (
		<div>
			<MobileSidebar />
			<Sidebar />
			<div className='md:pl-64'>
				<Navbar />
				{children}
			</div>
		</div>
	)
}

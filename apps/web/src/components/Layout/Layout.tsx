import { Navbar } from '../Navbar'
import { SidebarRoot } from '../Sidebar'

export interface LayoutProps {
	children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
	return (
		<div>
			<SidebarRoot />
			<div className='md:pl-64'>
				<Navbar />
				{children}
			</div>
		</div>
	)
}

import { Icon } from '@/components/Icon'
import { communities } from '@/constants/communities'
import { navigation } from '@/constants/navigation'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'

//export interface SidebarProps {}

export const Sidebar = (): JSX.Element => {
	const router = useRouter()
	const { pathname } = router

	return (
		<nav aria-label='Sidebar' className='sticky top-4 divide-y divide-gray-300'>
			<div className='space-y-1 pb-8'>
				{navigation.map((item) => {
					const current = pathname === item.href

					return (
						<Link
							key={item.name}
							href={item.href}
							className={twMerge(
								'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
								current
									? 'bg-gray-200 text-gray-900'
									: 'text-gray-700 hover:bg-gray-50',
							)}
						>
							<Icon
								id={item.icon}
								label={item.label}
								className={twMerge(
									'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
									current
										? 'text-gray-500'
										: 'text-gray-400 group-hover:text-gray-500',
								)}
							/>
							<span className='truncate'>{item.name}</span>
						</Link>
					)
				})}
			</div>
			<div className='pt-10'>
				<p
					className='px-3 text-sm font-medium text-gray-500'
					id='communities-headline'
				>
					Communities
				</p>
				<div className='mt-3 space-y-2' aria-labelledby='communities-headline'>
					{communities.map((community) => (
						<a
							key={community.name}
							href={community.href}
							className='group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900'
						>
							<span className='truncate'>{community.name}</span>
						</a>
					))}
				</div>
			</div>
		</nav>
	)
}

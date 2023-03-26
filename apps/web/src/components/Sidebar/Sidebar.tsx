import { Icon, IconId, Logo } from '@/components/Icon'
import { Disclosure } from '@headlessui/react'
import { cva } from 'cva'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { twMerge } from 'tailwind-merge'

export interface SidebarItem {
	name: string
	href?: string
	icon?: IconId
	children?: SidebarItem[]
	image?: string
	onClick?: () => void
}

export const sidebarLinks = cva(
	['group border-l-4 py-2 px-3 flex items-center text-sm font-medium w-full'],
	{
		variants: {
			intent: {
				headingWithoutSubitem: 'pl-2',
				headingWithSubitem:
					'pl-2 pr-1 text-left focus:outline-none focus:ring-2 focus:ring-primary-500',
				subitem: 'pl-7 pr-2',
			},
			active: {
				true: 'bg-primary-50 border-primary-600 text-primary-600',
				false:
					'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-md',
			},
			indentSubitem: {
				true: '',
				false: '',
			},
		},
		defaultVariants: {
			intent: 'headingWithoutSubitem',
			active: false,
			indentSubitem: false,
		},
		compoundVariants: [
			{
				intent: 'headingWithoutSubitem',
				indentSubitem: false,
				class: 'text-xs',
			},
			{
				intent: 'headingWithSubitem',
				indentSubitem: false,
				class: 'text-xs py-1',
			},
			{ intent: 'subitem', indentSubitem: false, class: 'pl-2' },
		],
	},
)

export const sidebarIcon = cva(['mr-3 flex-shrink-0 h-6 w-6 -ml-1'], {
	variants: {
		active: {
			true: 'text-primary-500',
			false: 'text-neutral-400 group-hover:text-neutral-500',
		},
	},
	defaultVariants: { active: false },
})

export interface SidebarProps {
	indentSubitem?: boolean
}

export const Sidebar = ({ indentSubitem }: SidebarProps): JSX.Element => {
	const router = useRouter()
	const { pathname } = router

	const isLinkActive = (item: SidebarItem) => {
		if (item.href) {
			return pathname === item.href
		}
		return false
	}

	return (
		<div className='hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col'>
			<nav
				className='flex flex-grow flex-col overflow-y-auto border-r border-neutral-200 bg-neutral-50 pt-5 pb-4'
				aria-label='Sidebar'
			>
				<div className='flex flex-shrink-0 items-center px-4 justify-start'>
					<Link href='/'>
						<Logo className='h-8 w-8' />
					</Link>
				</div>
				<div className='mt-5 flex-grow'>
					<div className='space-y-1 px-1'>
						{sidebarItems.map((item) => {
							const itemIsActive = isLinkActive(item)

							return !item.children ? (
								<Link
									key={item.name}
									href={item.href || '#'}
									onClick={item.onClick}
									className={twMerge(
										sidebarLinks({
											active: itemIsActive,
											intent: 'headingWithoutSubitem',
											indentSubitem,
										}),
									)}
									aria-current={itemIsActive ? 'page' : undefined}
								>
									{item.icon ? (
										<Icon
											id={item.icon}
											className={twMerge(sidebarIcon({ active: itemIsActive }))}
										/>
									) : null}
									<span className='truncate'>{item.name}</span>
								</Link>
							) : (
								<Disclosure
									as='div'
									key={item.name}
									className='space-y-1'
									defaultOpen
								>
									{({ open }) => (
										<>
											<Disclosure.Button
												className={twMerge(
													sidebarLinks({
														active: itemIsActive,
														intent: 'headingWithSubitem',
														indentSubitem,
													}),
												)}
												aria-current={itemIsActive ? 'page' : undefined}
											>
												{item.icon ? (
													<Icon
														id={item.icon}
														className={twMerge(sidebarIcon())}
														hidden
													/>
												) : null}
												<span className='flex-1 truncate'>{item.name}</span>
												<Icon
													id='triangle-right'
													className={twMerge(
														'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-neutral-400',
														open
															? 'text-neutral-400 rotate-90'
															: 'text-neutral-300',
													)}
													label={
														open
															? `Collapse ${item.name} sidebar items`
															: `Expand ${item.name} sidebar items`
													}
												/>
											</Disclosure.Button>

											{item.children ? (
												<Disclosure.Panel className='space-y-1'>
													{item.children.map((subItem) => {
														const subItemIsActive = isLinkActive(subItem)

														return (
															<Link
																key={subItem.name}
																href={subItem.href || '#'}
																onClick={subItem.onClick}
																className={twMerge(
																	sidebarLinks({
																		active: subItemIsActive,
																		intent: 'subitem',
																		indentSubitem,
																	}),
																)}
																aria-current={
																	subItemIsActive ? 'page' : undefined
																}
															>
																{subItem.icon ? (
																	<Icon
																		id={subItem.icon}
																		className={twMerge(
																			sidebarIcon({ active: subItemIsActive }),
																		)}
																		hidden
																	/>
																) : null}
																<span className='truncate'>{subItem.name}</span>
															</Link>
														)
													})}
												</Disclosure.Panel>
											) : null}
										</>
									)}
								</Disclosure>
							)
						})}
					</div>
				</div>
			</nav>
		</div>
	)
}

export const sidebarItems: SidebarItem[] = [
	{
		name: 'Feed',
		children: [
			{
				name: 'Current Page',
				href: '/test',
				icon: 'home',
			},
			{
				name: 'Home',
				href: '/',
				icon: 'home',
			},
			{
				name: 'Popular',
				href: '/r/popular',
				icon: 'fire',
			},
			{
				name: 'All',
				href: '/r/all',
				icon: 'user-group',
			},
			{
				name: 'Trending',
				href: '/r/trending',
				icon: 'arrow-trending-up',
			},
		],
	},
	{
		name: 'Your Communities',
		children: [
			{
				icon: 'plus-circle',
				name: 'Create Community',
				href: '/communities/new',
			},
			{
				name: 'r/node',
				href: '/r/node',
				icon: 'home',
			},
			{
				name: 'r/devops',
				href: '/r/devops',
				icon: 'fire',
			},
			{
				name: 'r/programming',
				href: '/r/programming',
				icon: 'user-group',
			},
			{
				name: 'r/reactjs',
				href: '/r/reactjs',
				icon: 'arrow-trending-up',
			},
		],
	},
]
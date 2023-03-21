import { CloseButton } from '@/components/Button'
import { Icon, Logo } from '@/components/Icon'
import { getFullName } from '@api/utils/string'
import { Transition, Dialog, Disclosure } from '@headlessui/react'
import Link from 'next/link'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

import {
	SidebarProps,
	sidebarIcon,
	SidebarItem,
	sidebarItems,
	sidebarLinks,
} from '.'
import { Avatar } from '../Avatar'
import { useNav } from '../Navbar'

export type MobileSidebarProps = SidebarProps

export const MobileSidebar = ({
	indentSubitem,
}: MobileSidebarProps): JSX.Element => {
	const { setNavIsOpen, navIsOpen, router, user, userNavigation } = useNav()
	const { pathname } = router

	const isLinkActive = (item: SidebarItem) => {
		if (item.href) {
			return pathname === item.href
		}
		return false
	}

	return (
		<Transition.Root show={navIsOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-40 md:hidden'
				onClose={setNavIsOpen}
			>
				<Transition.Child
					as={Fragment}
					enter='transition-opacity ease-linear duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='transition-opacity ease-linear duration-300'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-neutral-600 bg-opacity-75' />
				</Transition.Child>

				<div className='fixed inset-0 z-40 flex'>
					<Transition.Child
						as={Fragment}
						enter='transition ease-in-out duration-300 transform'
						enterFrom='-translate-x-full'
						enterTo='translate-x-0'
						leave='transition ease-in-out duration-300 transform'
						leaveFrom='translate-x-0'
						leaveTo='-translate-x-full'
					>
						<Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5'>
							<Transition.Child
								as={Fragment}
								enter='ease-in-out duration-300'
								enterFrom='opacity-0'
								enterTo='opacity-100'
								leave='ease-in-out duration-300'
								leaveFrom='opacity-100'
								leaveTo='opacity-0'
							>
								<div className='absolute top-0 right-0 -mr-12 p-2'>
									<CloseButton
										iconClass='h-6 w-6 text-white'
										className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:ring-2 focus:outline-none focus:ring-inset focus:ring-white'
										onClick={() => setNavIsOpen(false)}
										label='Close sidebar'
									/>
								</div>
							</Transition.Child>
							<div className='h-0 flex-1 overflow-y-auto pt-5 pb-4'>
								<div className='flex flex-shrink-0 items-center px-4'>
									<Link href='/'>
										<Logo className='h-8 w-8' />
									</Link>
								</div>
								<nav className='flex h-full flex-col' aria-label='Sidebar'>
									<div className='space-y-1 px-1 pt-1'>
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
															className={twMerge(
																sidebarIcon({ active: itemIsActive }),
															)}
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
																<span className='flex-1 truncate'>
																	{item.name}
																</span>
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
																		const subItemIsActive =
																			isLinkActive(subItem)

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
																							sidebarIcon({
																								active: subItemIsActive,
																							}),
																						)}
																						hidden
																					/>
																				) : null}
																				<span className='truncate'>
																					{subItem.name}
																				</span>
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
								</nav>
							</div>

							{user ? (
								<div className='border-t border-neutral-200 pt-2'>
									<div className='mt-auto space-y-1'>
										{userNavigation.map((item) => {
											return item.href ? (
												<Link
													key={item.name}
													href={item.href}
													className={twMerge(
														sidebarLinks({
															active: false,
															indentSubitem: true,
														}),
														'justify-center',
													)}
												>
													{item.name}
												</Link>
											) : (
												<button
													className='rounded-md py-2 px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 flex w-full items-center justify-center'
													onClick={item.onClick}
													key={item.name}
												>
													{item.name}
												</button>
											)
										})}

										<Link
											href='/posts/new'
											className={twMerge(
												sidebarLinks({
													active: false,
													indentSubitem: true,
												}),
												'justify-center',
											)}
										>
											New Post
										</Link>
									</div>

									<div className='flex flex-shrink-0 border-t border-neutral-200 p-4'>
										<div className='flex items-center'>
											<div>
												<Avatar src={user?.imageUrl} name={getFullName(user)} />
											</div>
											<div className='ml-3'>
												<p className='text-base font-medium text-gray-700 group-hover:text-gray-900'>
													{getFullName(user)}
												</p>
												<p className='text-sm font-medium text-gray-500 group-hover:text-gray-700'>
													{user.email}
												</p>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className='border-t border-neutral-200 py-2'>
									<div className='mt-auto space-y-1'>
										<Link
											href='/register'
											className={twMerge(
												sidebarLinks({
													active: false,
													indentSubitem: true,
													className: 'justify-center',
												}),
											)}
										>
											Register
										</Link>

										<Link
											href='/login'
											className={twMerge(
												sidebarLinks({
													active: false,
													indentSubitem: true,
													className: 'justify-center',
												}),
											)}
										>
											Login
										</Link>
									</div>
								</div>
							)}
						</Dialog.Panel>
					</Transition.Child>
					<div className='w-14 flex-shrink-0' aria-hidden='true'>
						{/* Dummy element to force sidebar to shrink to fit close icon */}
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

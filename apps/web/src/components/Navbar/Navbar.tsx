import { Icon } from '@/components/Icon'
import { RouterOutput } from '@/utils/trpc/types'
import { getFullName } from '@api/utils/string'
import { Menu, Transition } from '@headlessui/react'
import Link from 'next/link'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

import { useNav } from '.'
import { Avatar } from '../Avatar'
import { IconButton } from '../Button'

export type UserNavigation =
	| {
			name: string
			href: string
			onClick?: undefined
	  }
	| {
			name: string
			onClick: () => void
			href?: undefined
	  }

interface DesktopLinksProps {
	user?: RouterOutput['user']['me']
	userNavigation: UserNavigation[]
}

export const Navbar = (): JSX.Element => {
	const { setNavIsOpen, user, userNavigation } = useNav()

	return (
		<div className='sticky top-0 z-10 flex h-header flex-shrink-0 border-b border-neutral-200 bg-white'>
			<IconButton
				id='bars-3'
				iconClass='h-6 w-6'
				label='Open sidebar'
				className='border-r border-neutral-200 px-4 text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden'
				onClick={() => setNavIsOpen(true)}
			/>

			<div className='flex flex-1 justify-between px-6'>
				<div className='min-w-0 flex-1 lg:px-8'>
					<div className='flex items-center py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none'>
						<div className='w-full'>
							<div className='relative'>
								<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
									<Icon
										className='h-5 w-5 text-neutral-400'
										label='Search input'
										id='magnifying-glass'
										role='img'
									/>
								</div>
								<input
									id='search'
									name='search'
									className='block w-full rounded-md border border-neutral-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-neutral-500 focus:border-primary-500 focus:text-neutral-900 focus:placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm'
									placeholder='Search'
									type='search'
								/>
							</div>
						</div>
					</div>
				</div>

				<DesktopLinks user={user} userNavigation={userNavigation} />
			</div>
		</div>
	)
}

const DesktopLinks = ({ user, userNavigation }: DesktopLinksProps) => {
	if (user) {
		return (
			<div className='hidden md:flex md:items-center md:justify-end'>
				<Link
					href='/notifications'
					className='ml-5 flex-shrink-0 rounded-full bg-white p-1 text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
				>
					<Icon className='h-6 w-6' label='View notifications' id='bell' />
				</Link>

				{/* Profile dropdown */}
				<Menu as='div' className='relative ml-5 flex-shrink-0'>
					<div>
						<Menu.Button className='flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'>
							<span className='sr-only'>Open user menu</span>
							<Avatar src={user.imageUrl} name={getFullName(user)} />
						</Menu.Button>
					</div>
					<Transition
						as={Fragment}
						enter='transition ease-out duration-100'
						enterFrom='transform opacity-0 scale-95'
						enterTo='transform opacity-100 scale-100'
						leave='transition ease-in duration-75'
						leaveFrom='transform opacity-100 scale-100'
						leaveTo='transform opacity-0 scale-95'
					>
						<Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
							{userNavigation.map((item) => (
								<Menu.Item key={item.name}>
									{({ active }) => {
										return item.href ? (
											<Link
												href={item.href}
												className={twMerge(
													'block py-2 px-4 text-sm text-neutral-700',
													active ? 'bg-neutral-100' : '',
												)}
											>
												{item.name}
											</Link>
										) : (
											<button
												className={twMerge(
													'py-2 px-4 text-sm text-neutral-700 flex w-full items-center',
													active ? 'bg-neutral-100' : '',
												)}
												onClick={item.onClick}
											>
												{item.name}
											</button>
										)
									}}
								</Menu.Item>
							))}
						</Menu.Items>
					</Transition>
				</Menu>

				<Link
					href='/posts/new'
					className='ml-6 inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
				>
					New Post
				</Link>
			</div>
		)
	}

	return (
		<div className='hidden lg:flex lg:items-center lg:justify-end xl:col-span-5'>
			<Link
				href='/login'
				className='text-base font-medium text-neutral-500 hover:text-neutral-900'
			>
				Login
			</Link>
			<Link
				href='/register'
				className='ml-8 inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700'
			>
				Register
			</Link>
		</div>
	)
}

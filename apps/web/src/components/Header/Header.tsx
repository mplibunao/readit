import { navigation } from '@/constants/navigation'
import { client } from '@/utils/trpc/client'
import { RouterOutput } from '@/utils/trpc/types'
import { PROTECTED_PROCEDURE_AUTH_ERROR_TYPE } from '@api/utils/errors/trpcMiddlewareErrors'
import { getFullName } from '@api/utils/string'
import { Menu, Popover, Transition } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

import { Avatar } from '../Avatar/Avatar'
import { Icon } from '../Icon'
import { ActiveLink } from '../Link/ActiveLink'
import { styledLink } from '../Link/Link'
import { errorToast, successToast } from '../Toast/useToast'

type UserNavigation =
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

export interface HeaderProps {
	user?: RouterOutput['user']['me']
}
interface MobileMenuProps {
	user?: RouterOutput['user']['me']
	userNavigation: UserNavigation[]
}
interface DesktopLinksProps {
	user?: RouterOutput['user']['me']
	userNavigation: UserNavigation[]
}

export const Header = ({ user }: HeaderProps): JSX.Element => {
	const router = useRouter()
	const logoutMutation = client.user.logout.useMutation({
		onError: (error) => {
			switch (error.data?.type) {
				case PROTECTED_PROCEDURE_AUTH_ERROR_TYPE:
					errorToast({
						title: 'Already logged out',
						message: 'Redirecting to home page',
					})
					router.reload()
					break
				default:
					return errorToast({
						title: 'Error logging out',
						message: 'Something went wrong',
					})
			}
		},
		onSuccess: () => {
			successToast({
				title: 'Successfully logged out',
				message: 'See you soon!',
			})
			router.reload()
		},
	})

	const userNavigation: UserNavigation[] = [
		{ name: 'Your Profile', href: '/user/' },
		{ name: 'Settings', href: '/settings' },
		{
			name: 'Sign out',
			onClick: () => {
				logoutMutation.mutate()
			},
		},
	]

	return (
		<Popover
			as='header'
			className={({ open }) =>
				twMerge(
					open ? 'fixed inset-0 z-40 overflow-y-auto' : '',
					'bg-white shadow-sm lg:static lg:overflow-y-visible',
				)
			}
		>
			{({ open }) => (
				<>
					<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
						<div className='relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12'>
							<div className='flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2'>
								<div className='flex flex-shrink-0 items-center'>
									<Link href='/'>
										<Icon
											className='block h-8 w-8 text-primary-600'
											label='Logo'
											id='reddit'
										/>
									</Link>
								</div>
							</div>
							<div
								className={twMerge(
									'min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-5',
								)}
							>
								<div className='flex items-center px-6 py-4 md:mx-auto md:max-w-3xl lg:mx-0 lg:max-w-none xl:px-0'>
									<div className='w-full'>
										<div className='relative'>
											<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
												<Icon
													className='h-5 w-5 text-neutral-400'
													label='Search'
													id='magnifying-glass'
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

							<div className='flex items-center md:absolute md:inset-y-0 md:right-0 lg:hidden mr-4'>
								{/* Mobile menu button */}
								<Popover.Button className='-mx-2 inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500'>
									<span className='sr-only'>Open menu</span>
									{open ? (
										<Icon
											className='block h-6 w-6'
											id='mini-x-mark'
											label='Close navbar menu'
										/>
									) : (
										<Icon
											className='block h-6 w-6'
											label='Open navbar menu'
											id='bars-3'
										/>
									)}
								</Popover.Button>
							</div>
							<DesktopLinks user={user} userNavigation={userNavigation} />
						</div>
					</div>

					<MobileMenu user={user} userNavigation={userNavigation} />
				</>
			)}
		</Popover>
	)
}

const DesktopLinks = ({ user, userNavigation }: DesktopLinksProps) => {
	if (user) {
		return (
			<div className='hidden lg:flex lg:items-center lg:justify-end xl:col-span-5'>
				<a
					href='#'
					className='text-sm font-medium text-neutral-900 hover:underline'
				>
					Go Premium
				</a>
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
							<Avatar size='lg' src={user.imageUrl} name={getFullName(user)} />
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

const MobileMenu = ({ user, userNavigation }: MobileMenuProps) => {
	return (
		<Popover.Panel as='nav' className='lg:hidden' aria-label='Global'>
			<div className='mx-auto max-w-3xl space-y-1 px-2 pt-2 pb-3 sm:px-4'>
				{navigation.map((item) => (
					<ActiveLink
						key={item.name}
						href={item.href}
						activeClassName='bg-neutral-100 text-neutral-900'
						nonActiveClassName='hover:bg-neutral-50'
						className='block rounded-md py-2 px-3 text-base font-medium'
					>
						{item.name}
					</ActiveLink>
				))}
			</div>

			{user ? (
				<div className='border-t border-neutral-200 pt-4'>
					<div className='mx-auto flex max-w-3xl items-center px-4 sm:px-6'>
						<div className='flex-shrink-0'>
							<Avatar size='lg' src={user?.imageUrl} name={getFullName(user)} />
						</div>
						<div className='ml-3'>
							<div className='text-base font-medium text-neutral-800'>
								{getFullName(user)}
							</div>
							<div className='text-sm font-medium text-neutral-500'>
								{user.email}
							</div>
						</div>
						<button
							type='button'
							className='ml-auto flex-shrink-0 rounded-full bg-white p-1 text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
						>
							<Icon className='h-6 w-6' label='View notifications' id='bell' />
						</button>
					</div>
					<div className='mx-auto mt-3 max-w-3xl space-y-1 px-2 sm:px-4'>
						{userNavigation.map((item) => {
							return item.href ? (
								<Link
									key={item.name}
									href={item.href}
									className='block rounded-md py-2 px-3 text-base font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
								>
									{item.name}
								</Link>
							) : (
								<button
									className='rounded-md py-2 px-3 text-base font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 flex w-full items-center'
									onClick={item.onClick}
								>
									{item.name}
								</button>
							)
						})}
					</div>
				</div>
			) : null}

			{user ? (
				<div className='mx-auto mt-6 max-w-3xl px-4 sm:px-6'>
					<Link
						href='/posts/new'
						className='flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700'
					>
						New Post
					</Link>
				</div>
			) : (
				<div className='mx-auto mt-6 max-w-3xl px-4 sm:px-6'>
					<Link
						href='/register'
						className='flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700'
					>
						Register
					</Link>

					<div className='mt-6 flex justify-center'>
						Existing user?
						<div className='ml-1' />
						<Link href='/login' className={styledLink()}>
							Login
						</Link>
					</div>
				</div>
			)}
		</Popover.Panel>
	)
}

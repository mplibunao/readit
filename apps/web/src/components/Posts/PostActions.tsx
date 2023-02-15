import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'

export interface PostActionsProps {}

export const PostActions = (_props: PostActionsProps): JSX.Element => {
	return (
		<div className='flex flex-shrink-0 self-center'>
			<Menu as='div' className='relative inline-block text-left'>
				<div>
					<Menu.Button className='-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600'>
						<Icon
							className='h-5 w-5'
							id='ellipsis-horizontal-circle'
							label='Open post options'
						/>
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
					<Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
						<div className='py-1'>
							<Menu.Item>
								{({ active }) => (
									<a
										href='#'
										className={twMerge(
											active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
											'flex px-4 py-2 text-sm',
										)}
									>
										<Icon
											className='mr-3 h-5 w-5 text-gray-400'
											id='star'
											label='Add to favorites'
										/>
										<span>Add to favorites</span>
									</a>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<a
										href='#'
										className={twMerge(
											active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
											'flex px-4 py-2 text-sm',
										)}
									>
										<Icon
											className='mr-3 h-5 w-5 text-gray-400'
											id='flag'
											label='Report post'
										/>
										<span>Report content</span>
									</a>
								)}
							</Menu.Item>
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	)
}

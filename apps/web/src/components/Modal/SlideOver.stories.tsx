import { Menu, Transition } from '@headlessui/react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

import { useDisclosure } from '.'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { InputGroup, TextareaGroup } from '../Input'
import { SlideOver } from './SlideOver'

const tabs = [
	{ name: 'All', href: '#', current: true },
	{ name: 'Online', href: '#', current: false },
	{ name: 'Offline', href: '#', current: false },
]

const team = [
	{
		name: 'Tom Cook',
		email: 'tom.cook@example.com',
		handle: 'tom.cook@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		status: 'online',
	},
	{
		name: 'Whitney Francis',
		email: 'whitney.francis@example.com',
		handle: 'whitney.francis@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		status: 'online',
	},
	{
		name: 'Leonard Krasner',
		email: 'leonard.krasner@example.com',
		handle: 'leonard.krasner@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		status: 'online',
	},
	{
		name: 'Floyd Miles',
		email: 'floyd.miles@example.com',
		handle: 'floyd.miles@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		status: 'online',
	},
	{
		name: 'Emily Selman',
		email: 'emily.selman@example.com',
		handle: 'emily.selman@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		status: 'online',
	},
]

export const Empty = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root isOpen={isOpen} onClose={onClose}>
				<SlideOver.Panel>
					<SlideOver.Body>
						<SlideOver.Header>
							<SlideOver.Title>Panel title</SlideOver.Title>
							<SlideOver.CloseButton onClose={onClose} />
						</SlideOver.Header>
						<SlideOver.Content>Content goes here</SlideOver.Content>
					</SlideOver.Body>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const WideEmpty = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root isOpen={isOpen} onClose={onClose}>
				<SlideOver.Panel maxWidth='wide'>
					<SlideOver.Body>
						<SlideOver.Header>
							<SlideOver.Title>Panel title</SlideOver.Title>
							<SlideOver.CloseButton onClose={onClose} />
						</SlideOver.Header>
						<SlideOver.Content>Content goes here</SlideOver.Content>
					</SlideOver.Body>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const BackgroundOverlay = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root isOpen={isOpen} onClose={onClose} backgroundOverlay>
				<SlideOver.Panel>
					<SlideOver.Body>
						<SlideOver.Header>
							<SlideOver.Title>Panel title</SlideOver.Title>
							<SlideOver.CloseButton onClose={onClose} />
						</SlideOver.Header>
						<SlideOver.Content>Content goes here</SlideOver.Content>
					</SlideOver.Body>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const OutsideCloseButton = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root isOpen={isOpen} onClose={onClose} backgroundOverlay>
				<SlideOver.Panel closeButton='outside'>
					<SlideOver.Body>
						<SlideOver.OutsideCloseButton onClose={onClose} />
						<SlideOver.Header>
							<SlideOver.Title>Panel title</SlideOver.Title>
						</SlideOver.Header>
						<SlideOver.Content>Content goes here</SlideOver.Content>
					</SlideOver.Body>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const BrandedHeader = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root
				isOpen={isOpen}
				onClose={onClose}
				backgroundOverlay
				withSubtitle
				colorTheme='brandedPrimary'
			>
				<SlideOver.Panel>
					<SlideOver.Body>
						<SlideOver.Header
							withSubtitle
							subtitle={
								<SlideOver.Subtitle>
									Lorem, ipsum dolor sit amet consectetur adipisicing elit
									aliquam ad hic recusandae soluta.
								</SlideOver.Subtitle>
							}
						>
							<SlideOver.Title>Panel title</SlideOver.Title>
							<SlideOver.CloseButton onClose={onClose} />
						</SlideOver.Header>
						<SlideOver.Content>Content goes here</SlideOver.Content>
					</SlideOver.Body>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const StickyFooter = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root
				isOpen={isOpen}
				onClose={onClose}
				backgroundOverlay
				withFooter
			>
				<SlideOver.Panel>
					<SlideOver.Body>
						<SlideOver.Header>
							<SlideOver.Title>Panel title</SlideOver.Title>
							<SlideOver.CloseButton onClose={onClose} />
						</SlideOver.Header>
						<SlideOver.Content>Content goes here</SlideOver.Content>
					</SlideOver.Body>
					<SlideOver.Footer>
						<Button loadingText='' color='neutral' onClick={onClose}>
							Cancel
						</Button>
						<Button loadingText='' color='primary' className='ml-4 inline-flex'>
							Cancel
						</Button>
					</SlideOver.Footer>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const CreateProjectForm = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root
				isOpen={isOpen}
				onClose={onClose}
				backgroundOverlay
				withFooter
				withSubtitle
				colorTheme='brandedPrimary'
			>
				<SlideOver.Panel>
					<form>
						<SlideOver.Body>
							<SlideOver.Header
								withSubtitle
								subtitle={
									<SlideOver.Subtitle>
										Get started by filling in the information below to create
										your new project.
									</SlideOver.Subtitle>
								}
							>
								<SlideOver.Title>Panel title</SlideOver.Title>
								<SlideOver.CloseButton onClose={onClose} />
							</SlideOver.Header>
							<div className='flex flex-1 flex-col justify-between'>
								<div className='divide-y divide-gray-200 px-4 sm:px-6'>
									<div className='space-y-6 pb-5 pt-6'>
										<InputGroup
											name='projectName'
											label='Project name'
											type='text'
											errors={{}}
										/>
										<TextareaGroup
											name='description'
											label='Description'
											errors={{}}
										/>
										<div>
											<h3 className='text-sm font-medium leading-6 text-gray-900'>
												Team Members
											</h3>
											<div className='mt-2'>
												<div className='flex space-x-2'>
													{team.map((person) => (
														<a
															key={person.email}
															href={person.href}
															className='rounded-full hover:opacity-75'
														>
															<Avatar
																className='inline-block h-8 w-8 rounded-full'
																src={person.imageUrl}
																name={person.name}
															/>
														</a>
													))}
													<button
														type='button'
														className='inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
													>
														<span className='sr-only'>Add team member</span>
														<Icon
															id='plus-circle'
															className='h-5 w-5'
															aria-hidden='true'
														/>
													</button>
												</div>
											</div>
										</div>
										<fieldset>
											<legend className='text-sm font-medium leading-6 text-gray-900'>
												Privacy
											</legend>
											<div className='mt-2 space-y-4'>
												<div className='relative flex items-start'>
													<div className='absolute flex h-6 items-center'>
														<input
															id='privacy-public'
															name='privacy'
															aria-describedby='privacy-public-description'
															type='radio'
															className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
															defaultChecked
														/>
													</div>
													<div className='pl-7 text-sm leading-6'>
														<label
															htmlFor='privacy-public'
															className='font-medium text-gray-900'
														>
															Public access
														</label>
														<p
															id='privacy-public-description'
															className='text-gray-500'
														>
															Everyone with the link will see this project.
														</p>
													</div>
												</div>
												<div>
													<div className='relative flex items-start'>
														<div className='absolute flex h-6 items-center'>
															<input
																id='privacy-private-to-project'
																name='privacy'
																aria-describedby='privacy-private-to-project-description'
																type='radio'
																className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
															/>
														</div>
														<div className='pl-7 text-sm leading-6'>
															<label
																htmlFor='privacy-private-to-project'
																className='font-medium text-gray-900'
															>
																Private to project members
															</label>
															<p
																id='privacy-private-to-project-description'
																className='text-gray-500'
															>
																Only members of this project would be able to
																access.
															</p>
														</div>
													</div>
												</div>
												<div>
													<div className='relative flex items-start'>
														<div className='absolute flex h-6 items-center'>
															<input
																id='privacy-private'
																name='privacy'
																aria-describedby='privacy-private-to-project-description'
																type='radio'
																className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
															/>
														</div>
														<div className='pl-7 text-sm leading-6'>
															<label
																htmlFor='privacy-private'
																className='font-medium text-gray-900'
															>
																Private to you
															</label>
															<p
																id='privacy-private-description'
																className='text-gray-500'
															>
																You are the only one able to access this
																project.
															</p>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
									</div>
									<div className='pb-6 pt-4'>
										<div className='flex text-sm'>
											<a
												href='#'
												className='group inline-flex items-center font-medium text-indigo-600 hover:text-indigo-900'
											>
												<Icon
													id='share'
													className='h-5 w-5 text-indigo-500 group-hover:text-indigo-900'
												/>
												<span className='ml-2'>Copy link</span>
											</a>
										</div>
										<div className='mt-4 flex text-sm'>
											<a
												href='#'
												className='group inline-flex items-center text-gray-500 hover:text-gray-900'
											>
												<Icon
													id='exclamation-cicle'
													hidden
													className='h-5 w-5'
												/>
												<span className='ml-2'>Learn more about sharing</span>
											</a>
										</div>
									</div>
								</div>
							</div>
						</SlideOver.Body>
						<SlideOver.Footer>
							<Button loadingText='' color='neutral' onClick={onClose}>
								Cancel
							</Button>
							<Button
								loadingText=''
								color='primary'
								className='ml-4 inline-flex'
							>
								Submit
							</Button>
						</SlideOver.Footer>
					</form>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const WideCreateProjectForm = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root
				isOpen={isOpen}
				onClose={onClose}
				backgroundOverlay
				withFooter
				withSubtitle
			>
				<SlideOver.Panel maxWidth='wide'>
					<form>
						<SlideOver.Body>
							<SlideOver.Header
								subtitleContainerClassName='bg-neutral-50'
								withSubtitle
								subtitle={
									<SlideOver.Subtitle>
										Get started by filling in the information below to create
										your new project.
									</SlideOver.Subtitle>
								}
							>
								<SlideOver.Title>Panel title</SlideOver.Title>
								<SlideOver.CloseButton onClose={onClose} />
							</SlideOver.Header>
							<div className='flex flex-1 flex-col justify-between'>
								<div className='divide-y divide-gray-200 px-4 sm:px-6'>
									<div className='space-y-6 pb-5 pt-6'>
										<InputGroup
											name='projectName'
											label='Project name'
											type='text'
											errors={{}}
										/>
										<TextareaGroup
											name='description'
											label='Description'
											errors={{}}
										/>
										<div>
											<h3 className='text-sm font-medium leading-6 text-gray-900'>
												Team Members
											</h3>
											<div className='mt-2'>
												<div className='flex space-x-2'>
													{team.map((person) => (
														<a
															key={person.email}
															href={person.href}
															className='rounded-full hover:opacity-75'
														>
															<Avatar
																className='inline-block h-8 w-8 rounded-full'
																src={person.imageUrl}
																name={person.name}
															/>
														</a>
													))}
													<button
														type='button'
														className='inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
													>
														<span className='sr-only'>Add team member</span>
														<Icon
															id='plus-circle'
															className='h-5 w-5'
															aria-hidden='true'
														/>
													</button>
												</div>
											</div>
										</div>
										<fieldset>
											<legend className='text-sm font-medium leading-6 text-gray-900'>
												Privacy
											</legend>
											<div className='mt-2 space-y-4'>
												<div className='relative flex items-start'>
													<div className='absolute flex h-6 items-center'>
														<input
															id='privacy-public'
															name='privacy'
															aria-describedby='privacy-public-description'
															type='radio'
															className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
															defaultChecked
														/>
													</div>
													<div className='pl-7 text-sm leading-6'>
														<label
															htmlFor='privacy-public'
															className='font-medium text-gray-900'
														>
															Public access
														</label>
														<p
															id='privacy-public-description'
															className='text-gray-500'
														>
															Everyone with the link will see this project.
														</p>
													</div>
												</div>
												<div>
													<div className='relative flex items-start'>
														<div className='absolute flex h-6 items-center'>
															<input
																id='privacy-private-to-project'
																name='privacy'
																aria-describedby='privacy-private-to-project-description'
																type='radio'
																className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
															/>
														</div>
														<div className='pl-7 text-sm leading-6'>
															<label
																htmlFor='privacy-private-to-project'
																className='font-medium text-gray-900'
															>
																Private to project members
															</label>
															<p
																id='privacy-private-to-project-description'
																className='text-gray-500'
															>
																Only members of this project would be able to
																access.
															</p>
														</div>
													</div>
												</div>
												<div>
													<div className='relative flex items-start'>
														<div className='absolute flex h-6 items-center'>
															<input
																id='privacy-private'
																name='privacy'
																aria-describedby='privacy-private-to-project-description'
																type='radio'
																className='h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600'
															/>
														</div>
														<div className='pl-7 text-sm leading-6'>
															<label
																htmlFor='privacy-private'
																className='font-medium text-gray-900'
															>
																Private to you
															</label>
															<p
																id='privacy-private-description'
																className='text-gray-500'
															>
																You are the only one able to access this
																project.
															</p>
														</div>
													</div>
												</div>
											</div>
										</fieldset>
									</div>
									<div className='pb-6 pt-4'>
										<div className='flex text-sm'>
											<a
												href='#'
												className='group inline-flex items-center font-medium text-indigo-600 hover:text-indigo-900'
											>
												<Icon
													id='share'
													className='h-5 w-5 text-indigo-500 group-hover:text-indigo-900'
												/>
												<span className='ml-2'>Copy link</span>
											</a>
										</div>
										<div className='mt-4 flex text-sm'>
											<a
												href='#'
												className='group inline-flex items-center text-gray-500 hover:text-gray-900'
											>
												<Icon
													id='exclamation-cicle'
													hidden
													className='h-5 w-5'
												/>
												<span className='ml-2'>Learn more about sharing</span>
											</a>
										</div>
									</div>
								</div>
							</div>
						</SlideOver.Body>
						<SlideOver.Footer>
							<Button loadingText='' color='neutral' onClick={onClose}>
								Cancel
							</Button>
							<Button
								loadingText=''
								color='primary'
								className='ml-4 inline-flex'
							>
								Submit
							</Button>
						</SlideOver.Footer>
					</form>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const UserProfile = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root isOpen={isOpen} onClose={onClose} backgroundOverlay>
				<SlideOver.Panel>
					<SlideOver.Body>
						<SlideOver.Header
							subtitleContainerClassName='bg-white-50'
							withSubtitle
						>
							<SlideOver.Title>Profile</SlideOver.Title>
							<SlideOver.CloseButton onClose={onClose} />
						</SlideOver.Header>
						<div>
							<div className='pb-1 sm:pb-6'>
								<div>
									<div className='relative h-40 sm:h-56'>
										<img
											className='absolute h-full w-full object-cover'
											src='https://images.unsplash.com/photo-1501031170107-cfd33f0cbdcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&h=600&q=80'
											alt=''
										/>
									</div>
									<div className='mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6'>
										<div className='sm:flex-1'>
											<div>
												<div className='flex items-center'>
													<h3 className='text-xl font-bold text-gray-900 sm:text-2xl'>
														Ashley Porter
													</h3>
													<span className='ml-2.5 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400'>
														<span className='sr-only'>Online</span>
													</span>
												</div>
												<p className='text-sm text-gray-500'>@ashleyporter</p>
											</div>
											<div className='mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0'>
												<button
													type='button'
													className='inline-flex w-full flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:flex-1'
												>
													Message
												</button>
												<button
													type='button'
													className='inline-flex w-full flex-1 items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
												>
													Call
												</button>
												<div className='ml-3 inline-flex sm:ml-0'>
													<Menu
														as='div'
														className='relative inline-block text-left'
													>
														<Menu.Button className='inline-flex items-center rounded-md bg-white p-2 text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
															<span className='sr-only'>Open options menu</span>
															<Icon
																className='h-5 w-5'
																hidden
																id='ellipsis-horizontal-circle'
															/>
														</Menu.Button>
														<Transition
															as={React.Fragment}
															enter='transition ease-out duration-100'
															enterFrom='transform opacity-0 scale-95'
															enterTo='transform opacity-100 scale-100'
															leave='transition ease-in duration-75'
															leaveFrom='transform opacity-100 scale-100'
															leaveTo='transform opacity-0 scale-95'
														>
															<Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
																<div className='py-1'>
																	<Menu.Item>
																		{({ active }) => (
																			<a
																				href='#'
																				className={twMerge(
																					active
																						? 'bg-gray-100 text-gray-900'
																						: 'text-gray-700',
																					'block px-4 py-2 text-sm',
																				)}
																			>
																				View profile
																			</a>
																		)}
																	</Menu.Item>
																	<Menu.Item>
																		{({ active }) => (
																			<a
																				href='#'
																				className={twMerge(
																					active
																						? 'bg-gray-100 text-gray-900'
																						: 'text-gray-700',
																					'block px-4 py-2 text-sm',
																				)}
																			>
																				Copy profile link
																			</a>
																		)}
																	</Menu.Item>
																</div>
															</Menu.Items>
														</Transition>
													</Menu>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='px-4 pb-5 pt-5 sm:px-0 sm:pt-0'>
								<dl className='space-y-8 px-4 sm:space-y-6 sm:px-6'>
									<div>
										<dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
											Bio
										</dt>
										<dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
											<p>
												Enim feugiat ut ipsum, neque ut. Tristique mi id
												elementum praesent. Gravida in tempus feugiat netus enim
												aliquet a, quam scelerisque. Dictumst in convallis nec
												in bibendum aenean arcu.
											</p>
										</dd>
									</div>
									<div>
										<dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
											Location
										</dt>
										<dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
											New York, NY, USA
										</dd>
									</div>
									<div>
										<dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
											Website
										</dt>
										<dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
											ashleyporter.com
										</dd>
									</div>
									<div>
										<dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
											Birthday
										</dt>
										<dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
											<time dateTime='1988-06-23'>June 23, 1988</time>
										</dd>
									</div>
								</dl>
							</div>
						</div>
					</SlideOver.Body>
					<SlideOver.Footer>
						<Button loadingText='' color='neutral' onClick={onClose}>
							Cancel
						</Button>
						<Button loadingText='' color='primary' className='ml-4 inline-flex'>
							Submit
						</Button>
					</SlideOver.Footer>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

export const ContactList = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<SlideOver.Root isOpen={isOpen} onClose={onClose} backgroundOverlay>
				<SlideOver.Panel>
					<SlideOver.Body>
						<SlideOver.Header>
							<SlideOver.Title>Team</SlideOver.Title>
							<SlideOver.CloseButton onClose={onClose} />
						</SlideOver.Header>

						<div className='border-b border-gray-200'>
							<div className='px-6'>
								<nav
									className='-mb-px flex space-x-6'
									x-descriptions='Tab component'
								>
									{tabs.map((tab) => (
										<a
											key={tab.name}
											href={tab.href}
											className={twMerge(
												tab.current
													? 'border-indigo-500 text-indigo-600'
													: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
												'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium',
											)}
										>
											{tab.name}
										</a>
									))}
								</nav>
							</div>
						</div>

						<ul
							role='list'
							className='flex-1 divide-y divide-gray-200 overflow-y-auto'
						>
							{team.map((person) => (
								<li key={person.handle}>
									<div className='group relative flex items-center px-5 py-6'>
										<a href={person.href} className='-m-1 block flex-1 p-1'>
											<div
												className='absolute inset-0 group-hover:bg-gray-50'
												aria-hidden='true'
											/>
											<div className='relative flex min-w-0 flex-1 items-center'>
												<span className='relative inline-block flex-shrink-0'>
													<Avatar
														className='h-10 w-10 rounded-full'
														src={person.imageUrl}
														name={person.name}
													/>
													<span
														className={twMerge(
															person.status === 'online'
																? 'bg-green-400'
																: 'bg-gray-300',
															'absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white',
														)}
														aria-hidden='true'
													/>
												</span>
												<div className='ml-4 truncate'>
													<p className='truncate text-sm font-medium text-gray-900'>
														{person.name}
													</p>
													<p className='truncate text-sm text-gray-500'>
														{person.handle}
													</p>
												</div>
											</div>
										</a>
										<Menu
											as='div'
											className='relative ml-2 inline-block flex-shrink-0 text-left'
										>
											<Menu.Button className='group relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
												<span className='sr-only'>Open options menu</span>
												<span className='flex h-full w-full items-center justify-center rounded-full'>
													<Icon
														className='h-5 w-5 text-gray-400 group-hover:text-gray-500'
														hidden
														id='ellipsis-horizontal-circle'
													/>
												</span>
											</Menu.Button>
											<Transition
												as={React.Fragment}
												enter='transition ease-out duration-100'
												enterFrom='transform opacity-0 scale-95'
												enterTo='transform opacity-100 scale-100'
												leave='transition ease-in duration-75'
												leaveFrom='transform opacity-100 scale-100'
												leaveTo='transform opacity-0 scale-95'
											>
												<Menu.Items className='absolute right-9 top-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
													<div className='py-1'>
														<Menu.Item>
															{({ active }) => (
																<a
																	href='#'
																	className={twMerge(
																		active
																			? 'bg-gray-100 text-gray-900'
																			: 'text-gray-700',
																		'block px-4 py-2 text-sm',
																	)}
																>
																	View profile
																</a>
															)}
														</Menu.Item>
														<Menu.Item>
															{({ active }) => (
																<a
																	href='#'
																	className={twMerge(
																		active
																			? 'bg-gray-100 text-gray-900'
																			: 'text-gray-700',
																		'block px-4 py-2 text-sm',
																	)}
																>
																	Send message
																</a>
															)}
														</Menu.Item>
													</div>
												</Menu.Items>
											</Transition>
										</Menu>
									</div>
								</li>
							))}
						</ul>
					</SlideOver.Body>
				</SlideOver.Panel>
			</SlideOver.Root>
		</>
	)
}

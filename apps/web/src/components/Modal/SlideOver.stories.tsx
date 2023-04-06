import { useDisclosure } from '.'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { InputGroup, TextareaGroup } from '../Input'
import { SlideOver } from './SlideOver'

const team = [
	{
		name: 'Tom Cook',
		email: 'tom.cook@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	{
		name: 'Whitney Francis',
		email: 'whitney.francis@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	{
		name: 'Leonard Krasner',
		email: 'leonard.krasner@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	{
		name: 'Floyd Miles',
		email: 'floyd.miles@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
	},
	{
		name: 'Emily Selman',
		email: 'emily.selman@example.com',
		href: '#',
		imageUrl:
			'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
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
			<SlideOver.Root isOpen={isOpen} onClose={onClose} backgroundOverlay>
				<SlideOver.Panel withSubtitle colorTheme='brandedPrimary'>
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
			<SlideOver.Root isOpen={isOpen} onClose={onClose} backgroundOverlay>
				<SlideOver.Panel withFooter>
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
			<SlideOver.Root isOpen={isOpen} onClose={onClose} backgroundOverlay>
				<SlideOver.Panel withFooter withSubtitle colorTheme='brandedPrimary'>
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
															<img
																className='inline-block h-8 w-8 rounded-full'
																src={person.imageUrl}
																alt={person.name}
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
			<SlideOver.Root isOpen={isOpen} onClose={onClose} backgroundOverlay>
				<SlideOver.Panel withFooter withSubtitle maxWidth='wide'>
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
															<img
																className='inline-block h-8 w-8 rounded-full'
																src={person.imageUrl}
																alt={person.name}
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

import { Story } from '@ladle/react'
import { useRef } from 'react'

import { useDisclosure } from '.'
import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'
import { Modal } from './Modal'

export const Default: Story = () => {
	const cancelRef = useRef<HTMLButtonElement>(null)
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<Modal.Root isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
				<Modal.Panel>
					<Modal.CloseButton onClose={onClose} />
					<div>
						<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success-100'>
							<Icon
								className='h-12 w-12 text-success-600'
								id='outline-check-circle'
								label='check'
							/>
						</div>
						<div className='mt-3 text-center sm:mt-5'>
							<Modal.Title>Payment successful</Modal.Title>
							<Modal.Description>
								<span className='text-sm text-neutral-500'>
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Consequatur amet labore.
								</span>
							</Modal.Description>
						</div>
					</div>
					<Modal.Actions>
						<Button
							loadingText='loading'
							className='inline-flex w-full justify-center rounded-md sm:ml-3 sm:w-auto'
						>
							Deactivate
						</Button>
						<Button
							loadingText='loading'
							color='error'
							ref={cancelRef}
							className='mt-3 inline-flex w-full sm:mt-0 sm:w-auto'
						>
							Cancel
						</Button>
					</Modal.Actions>
				</Modal.Panel>
			</Modal.Root>
		</>
	)
}

export const WideCenterButtons: Story = () => {
	const cancelRef = useRef<HTMLButtonElement>(null)
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<Modal.Root isOpen={isOpen} onClose={onClose} initialFocus={cancelRef}>
				<Modal.Panel maxWidth='lg'>
					<Modal.CloseButton onClose={onClose} />
					<div className='sm:flex sm:items-start'>
						<div className='mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-error-100   sm:mx-0 sm:h-10 sm:w-10 flex-shrink-0'>
							<Icon
								className='h-10 w-10 text-error-600'
								id='exclamation-cicle'
								label='check'
							/>
						</div>
						<div className='mt-3 text-center sm:mt-0  sm:ml-4 sm:text-left'>
							<Modal.Title className='mt-2'>Payment successful</Modal.Title>
							<Modal.Description>
								<span className='text-sm text-neutral-500'>
									Are you sure you want to deactivate your account? All of your
									data will be permanently removed from our servers forever.
									This action cannot be undone.
								</span>
							</Modal.Description>
						</div>
					</div>
					<Modal.Actions intent='centerColumns'>
						<Button loadingText='loading' className='w-full' ref={cancelRef}>
							Deactivate
						</Button>
						<Button
							loadingText='loading'
							color='error'
							className='w-full mt-3 sm:mt-0'
						>
							Cancel
						</Button>
					</Modal.Actions>
				</Modal.Panel>
			</Modal.Root>
		</>
	)
}

export const Registration: Story = () => {
	const { isOpen, onClose, onOpen } = useDisclosure()
	return (
		<>
			<Button loadingText='loading' onClick={onOpen}>
				Open modal
			</Button>
			<Modal.Root isOpen={isOpen} onClose={onClose}>
				<Modal.Panel maxWidth='lg'>
					<Modal.CloseButton onClose={onClose} />
					<div>
						<div className='mx-auto flex items-center justify-center'>
							<Icon
								className='h-12 w-12'
								id='email-fast-outline'
								label='check'
							/>
						</div>
						<div className='mt-3 text-center sm:mt-5'>
							<Modal.Title className='font-bold'>
								Email Confirmation
							</Modal.Title>
							<Modal.Description>
								<span className='text-sm text-neutral-500'>
									We sent an email confirmation link to your registered{' '}
									<span className='font-bold'>email address</span>. Please check
									your inbox and click the link to verify your email and
									continue.
								</span>

								<span className='py-2' />

								<span className='text-sm text-neutral-500'>
									Did not recieve the email?
								</span>
							</Modal.Description>
						</div>
					</div>
					<Modal.Actions intent='centerAlign' className='flex justify-center'>
						<Button loadingText='Resending..' className='w-1/2'>
							Resend
						</Button>
					</Modal.Actions>
				</Modal.Panel>
			</Modal.Root>
		</>
	)
}

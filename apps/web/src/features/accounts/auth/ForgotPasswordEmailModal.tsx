import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import { Modal } from '@/components/Modal/Modal'
import React from 'react'

export interface ForgotPasswordEmailModalProps {
	isOpen: boolean
	onClose: () => void
	allowResendEmail: boolean
	handleResendEmail: () => void
	remainingTime: number
}

export const ForgotPasswordEmailModal = ({
	isOpen,
	onClose,
	allowResendEmail,
	handleResendEmail,
	remainingTime,
}: ForgotPasswordEmailModalProps) => {
	const resendRef = React.useRef<HTMLButtonElement>(null)
	return (
		<>
			<Modal.Root isOpen={isOpen} onClose={onClose} initialFocus={resendRef}>
				<Modal.Panel maxWidth='lg'>
					<Modal.CloseButton onClose={onClose} />
					<div>
						<div className='mx-auto flex items-center justify-center'>
							<Icon className='h-12 w-12' id='email-fast-outline' hidden />
						</div>
						<div className='mt-3 text-center sm:mt-5'>
							<Modal.Title className='font-bold'>Forgot Password</Modal.Title>
							<Modal.Description>
								<span className='text-sm text-neutral-500'>
									We sent an reset password link to your{' '}
									<span className='font-bold'>email address</span>. Please check
									your inbox and click the link to change your password.
								</span>

								<span className='py-2 block' />

								<span className='text-sm text-neutral-500'>
									Did not recieve the email?
								</span>
							</Modal.Description>
						</div>
					</div>
					<Modal.Actions intent='centerAlign' className='flex justify-center'>
						<Button
							loadingText='Sending..'
							className='w-1/2'
							disabled={!allowResendEmail}
							onClick={handleResendEmail}
							ref={resendRef}
						>
							{allowResendEmail ? 'Resend' : `Resend in ${remainingTime}`}
						</Button>
					</Modal.Actions>
				</Modal.Panel>
			</Modal.Root>
		</>
	)
}

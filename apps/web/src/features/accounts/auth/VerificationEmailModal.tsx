import { Button } from '@/components/Button'
import { Icon } from '@/components/Icon'
import { useDisclosure } from '@/components/Modal'
import { Modal } from '@/components/Modal/Modal'
import React from 'react'

export const useVerificationEmail = ({
	resendCooldownMinutes = 5,
}: {
	resendCooldownMinutes?: number
} = {}) => {
	const showModal = useDisclosure()
	const [allowResendEmail, setAllowResendEmail] = React.useState(true)
	const [remainingTime, setRemainingTime] = React.useState<number>(0)

	const resetResendEmailCooldown = () => {
		setRemainingTime(resendCooldownMinutes * 60)
		setAllowResendEmail(false)
		setTimeout(() => {
			setAllowResendEmail(true)
		}, resendCooldownMinutes * 60 * 1000)
	}

	React.useEffect(() => {
		if (remainingTime > 0) {
			const intervalId = setInterval(() => {
				setRemainingTime((prev) => prev - 1)
			}, 1000)
			return () => clearInterval(intervalId)
		}

		return
	}, [allowResendEmail, remainingTime])

	return {
		...showModal,
		resetResendEmailCooldown,
		allowResendEmail,
		remainingTime,
	}
}

export interface VerificationEmailModalProps {
	isOpen: boolean
	onClose: () => void
	allowResendEmail: boolean
	handleResendEmail: () => void
	remainingTime: number
}

export const VerificationEmailModal = ({
	isOpen,
	onClose,
	allowResendEmail,
	handleResendEmail,
	remainingTime,
}: VerificationEmailModalProps) => {
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
							<Modal.Title className='font-bold'>
								Email Verification
							</Modal.Title>
							<Modal.Description>
								<span className='text-sm text-neutral-500'>
									We sent an email verification link to your registered{' '}
									<span className='font-bold'>email address</span>. Please check
									your inbox and click the link to verify your email and
									continue.
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

import { Button } from '@/components/Button'
import { Form, FormButton, FormInput, useZodForm } from '@/components/Forms'
import { FormPassword } from '@/components/Forms/FormPassword'
import { Logo } from '@/components/Icon'
import { BaseModalProps, Modal } from '@/components/Modal/Modal'
import { errorToast, successToast } from '@/components/Toast'
import { client } from '@/utils/trpc/client'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import React from 'react'

import { useVerificationEmail, VerificationEmailModal } from '../auth'

export interface ChangeEmailModalProps extends BaseModalProps {
	userId: string
	hasPassword?: boolean
}

export const ChangeEmailModal = ({
	isOpen,
	onClose,
	userId,
	hasPassword,
}: ChangeEmailModalProps): JSX.Element => {
	const trpcUtils = client.useContext()
	const passwordRef = React.useRef<HTMLInputElement>(null)
	const form = useZodForm({
		schema: UserSchemas.requestChangeEmailInput,
		defaultValues: {
			userId,
			hasPassword,
		},
	})

	const confirmationEmailModal = useVerificationEmail({
		resendCooldownMinutes: 5,
	})

	const changeEmailMutation = client.auth.requestChangeEmail.useMutation({
		onError: (error) =>
			errorToast({ title: 'Change email error', message: error.message }),
		onSuccess: () => {
			trpcUtils.user.getStatus.invalidate()
			successToast({
				title: 'Please check your inbox',
				message: 'An email has been sent to your new email address.',
			})
			onClose()
			confirmationEmailModal.onOpen()
			confirmationEmailModal.resetResendEmailCooldown()
		},
	})

	const handleChangeEmail = async (
		params: UserSchemas.RequestChangeEmailInput,
	) => {
		changeEmailMutation.mutate(params)
	}

	const handleResendEmail = async () => {
		const values = form.getValues()
		changeEmailMutation.mutate(values)
		confirmationEmailModal.resetResendEmailCooldown()
	}

	return (
		<>
			<VerificationEmailModal
				isOpen={confirmationEmailModal.isOpen}
				onClose={confirmationEmailModal.onClose}
				handleResendEmail={handleResendEmail}
				remainingTime={confirmationEmailModal.remainingTime}
				allowResendEmail={confirmationEmailModal.allowResendEmail}
			/>
			<Modal.Root isOpen={isOpen} onClose={onClose} initialFocus={passwordRef}>
				<Modal.Panel maxWidth='md' padding='md'>
					<Form form={form} onSubmit={handleChangeEmail}>
						<Modal.CloseButton onClose={onClose} />
						<div>
							<div className='mx-auto flex items-center justify-center'>
								<Logo className='mx-auto' />
							</div>

							<div className='mt-3 text-center sm:mt-5'>
								<Modal.Title className='font-bold'>
									Change your Email
								</Modal.Title>
								<Modal.Description>
									<span className='text-sm text-neutral-500'>
										Update your email below. There will be a new verification
										email sent that you need to use to verify this new email.
									</span>
								</Modal.Description>
								<div className='space-y-4'>
									<FormInput type='hidden' name='userId' label='User' />

									{hasPassword ? (
										<>
											<FormPassword
												label='Current Password'
												ariaLabelName='current password'
												name='password'
												required
												placeholder='Enter current password'
												ref={passwordRef}
											/>
										</>
									) : null}

									<FormInput
										label='New Email'
										name='newEmail'
										type='email'
										placeholder='Enter your new email'
										required
									/>
								</div>
							</div>
						</div>

						<Modal.Actions intent='centerColumns'>
							<Button
								loadingText='Cancel'
								intent='outline'
								color='neutral'
								className='w-full rounded-md'
								onClick={onClose}
							>
								Cancel
							</Button>
							<FormButton
								type='submit'
								loadingText='Saving Email..'
								className='w-full rounded-md mt-3 sm:mt-0'
								loading={changeEmailMutation.isLoading}
							>
								Save Email
							</FormButton>
						</Modal.Actions>
					</Form>
				</Modal.Panel>
			</Modal.Root>
		</>
	)
}

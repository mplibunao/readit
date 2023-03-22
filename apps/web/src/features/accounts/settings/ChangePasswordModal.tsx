import { Button } from '@/components/Button'
import { Form, FormButton, FormInput, useZodForm } from '@/components/Forms'
import { FormPassword } from '@/components/Forms/FormPassword'
import { Logo } from '@/components/Icon'
import { BaseModalProps, Modal } from '@/components/Modal'
import { errorToast, successToast } from '@/components/Toast'
import { client } from '@/utils/trpc/client'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import React from 'react'

export interface ChangePasswordModalProps extends BaseModalProps {
	userId: string
	hasPassword?: boolean
}

export const ChangePasswordModal = ({
	isOpen,
	onClose,
	userId,
	hasPassword,
}: ChangePasswordModalProps): JSX.Element => {
	const trpcUtils = client.useContext()
	const oldPasswordRef = React.useRef<HTMLInputElement>(null)
	const form = useZodForm({
		schema: UserSchemas.changePasswordInput,
		defaultValues: {
			userId,
			hasPassword,
		},
	})

	const changePasswordMutation = client.auth.changePassword.useMutation({
		onError: (error) =>
			errorToast({ title: 'Change password error', message: error.message }),
		onSuccess: () => {
			trpcUtils.user.getStatus.invalidate()
			successToast({
				title: 'Change password success',
				message: 'Your password has successfully been changed.',
			})
			form.reset()
			onClose()
		},
	})

	const handleChangePassword = async (
		params: UserSchemas.ChangePasswordInput,
	) => {
		changePasswordMutation.mutate(params)
	}

	return (
		<Modal.Root isOpen={isOpen} onClose={onClose} initialFocus={oldPasswordRef}>
			<Modal.Panel maxWidth='md' padding='md'>
				<Form form={form} onSubmit={handleChangePassword}>
					<Modal.CloseButton onClose={onClose} />
					<div>
						<div className='mx-auto flex items-center justify-center'>
							<Logo className='mx-auto' />
						</div>

						<div className='mt-3 text-center sm:mt-5'>
							<Modal.Title className='font-bold'>Change Password</Modal.Title>
							<div className='space-y-4'>
								<FormInput type='hidden' name='userId' label='User' />

								{hasPassword ? (
									<>
										<FormPassword
											label='Old Password'
											ariaLabelName='old password'
											name='oldPassword'
											required
											placeholder='Enter current password'
											ref={oldPasswordRef}
										/>
										<FormPassword
											label='New Password'
											ariaLabelName='new password'
											name='newPassword'
											required
										/>
									</>
								) : (
									<>
										<FormPassword
											label='New Password'
											ariaLabelName='new password'
											name='newPassword'
											required
											ref={oldPasswordRef}
										/>
									</>
								)}

								<FormPassword
									label='Confirm New Password'
									ariaLabelName='confirm new password'
									name='confirmPassword'
									allowShowPassword
									placeholder='Repeat new password'
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
							loadingText='Changing Password..'
							className='w-full rounded-md mt-3 sm:mt-0'
							loading={changePasswordMutation.isLoading}
						>
							Change Password
						</FormButton>
					</Modal.Actions>
				</Form>
			</Modal.Panel>
		</Modal.Root>
	)
}

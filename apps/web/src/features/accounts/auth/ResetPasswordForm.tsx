import { Form, FormButton, FormInput, useZodForm } from '@/components/Forms'
import { FormPassword } from '@/components/Forms/FormPassword'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'

export interface ResetPasswordFormProps {
	token: string
	handleSubmit: (params: UserSchemas.ResetPasswordInput) => void
	isSubmitting: boolean
}

export const ResetPasswordForm = ({
	handleSubmit,
	isSubmitting,
	token,
}: ResetPasswordFormProps): JSX.Element => {
	const form = useZodForm({
		schema: UserSchemas.resetPasswordInput,
		defaultValues: {
			token,
		},
	})

	return (
		<Form
			form={form}
			onSubmit={handleSubmit}
			fieldsetProps={{ className: 'space-y-6' }}
		>
			<FormInput type='hidden' name='token' label='Token' />

			<FormPassword
				label='New Password'
				ariaLabelName='new password'
				name='newPassword'
				required
				allowShowPassword
			/>

			<div>
				<FormButton
					className='flex w-full justify-center'
					loadingText='Submitting'
					loading={isSubmitting}
				>
					Submit
				</FormButton>
			</div>
		</Form>
	)
}

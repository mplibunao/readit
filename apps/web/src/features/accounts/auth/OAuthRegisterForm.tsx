import { Form, FormButton, FormInput, useZodForm } from '@/components/Forms'
import { RouterOutput } from '@/utils/trpc/types'
import { OAuthSchemas } from '@api/modules/accounts/domain/oAuth.schema'

export interface OAuthRegisterFormProps {
	partialUser: RouterOutput['auth']['getPartialOAuthUser']
	handleSubmit: (params: OAuthSchemas.CreateOAuthUserInput) => void
	isSubmitting: boolean
}

export const OAuthRegisterForm = ({
	partialUser,
	handleSubmit,
	isSubmitting,
}: OAuthRegisterFormProps): JSX.Element => {
	const form = useZodForm({
		schema: OAuthSchemas.createOAuthUserInput,
		defaultValues: partialUser,
	})

	return (
		<Form
			form={form}
			onSubmit={handleSubmit}
			fieldsetProps={{ className: 'space-y-6' }}
		>
			<FormInput type='hidden' name='user.imageUrl' label='Profile Picture' />

			<FormInput
				type='text'
				name='user.firstName'
				label='First Name'
				placeholder='John'
				required
			/>

			<FormInput
				type='text'
				name='user.lastName'
				label='Last Name'
				placeholder='Doe'
				required
			/>

			<FormInput
				type='text'
				name='user.email'
				label='Email'
				placeholder='Enter your email'
				required
				disabled
			/>

			<FormInput
				type='text'
				name='user.username'
				label='Username'
				placeholder='Enter your username'
				required
			/>

			<div>
				<FormButton
					className='flex w-full justify-center'
					loadingText='Creating account..'
					loading={isSubmitting}
				>
					Create an account
				</FormButton>
			</div>
		</Form>
	)
}

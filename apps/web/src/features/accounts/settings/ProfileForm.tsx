import { Form, FormButton, useZodForm, FormInput } from '@/components/Forms'
import { UserDto } from '@api/modules/accounts/dtos/user.dto'

import { SettingsSection } from './SettingsSection'

export interface ProfileFormProps {
	handleSubmit: (values: UserDto.UpdateProfileInput) => void
	user?: UserDto.UpdateProfileInput
	isSubmitting: boolean
}

export const ProfileForm = ({
	user,
	handleSubmit,
	isSubmitting,
}: ProfileFormProps): JSX.Element => {
	const form = useZodForm({
		schema: UserDto.updateProfileInput,
		defaultValues: user,
	})
	return (
		<Form form={form} onSubmit={handleSubmit}>
			<SettingsSection
				title='Profile'
				subtitle='Customize your profile information'
			>
				<div className='mt-6 space-y-6'>
					<FormInput type='hidden' name='id' label='id' required />

					<div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
						<div className='sm:col-span-3'>
							<FormInput
								type='text'
								name='firstName'
								label='First name'
								required
							/>
						</div>
						<div className='sm:col-span-3'>
							<FormInput
								type='text'
								name='lastName'
								label='Last name'
								required
							/>
						</div>
					</div>
				</div>
			</SettingsSection>

			<div className='mt-4 flex justify-end pt-4 px-4 sm:px-6'>
				<FormButton
					loadingText='Saving profile'
					className='rounded-md'
					loading={isSubmitting}
				>
					Save profile
				</FormButton>
			</div>
		</Form>
	)
}

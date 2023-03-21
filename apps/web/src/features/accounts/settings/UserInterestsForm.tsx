import { Form, FormMultiComboBox, useZodForm } from '@/components/Forms'
import { Icon } from '@/components/Icon'
import { RouterOutput } from '@/utils/trpc/types'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import { TagSchemas } from '@api/modules/recommendations/domain/tag.schema'

export interface UserInterestsFormProps {
	handleSubmit: (values: UserSchemas.UpsertUserInterestsInput) => void
	userInterests: RouterOutput['user']['getInterests']
	tags: TagSchemas.Tag[]
	children: React.ReactNode
}

export const UserInterestsForm = (
	props: UserInterestsFormProps,
): JSX.Element => {
	const form = useZodForm({
		schema: UserSchemas.upsertUserInterestsInput,
		defaultValues: {
			tagIds: props.userInterests.map((userInterest) => userInterest.tagId),
		},
	})

	const tagOptions = props.tags.map((tag) => {
		return { display: tag.name, value: tag.id }
	})

	return (
		<Form form={form} onSubmit={props.handleSubmit}>
			<div className='mt-6'>
				<div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
					<div className='sm:col-span-6'>
						<FormMultiComboBox
							control={form.control}
							label='Interests'
							name='tagIds'
							options={tagOptions}
							iconDirection='right'
							maxSelected={10}
							selectedOptionIcon={<Icon id='check' className='h-5 w-5' />}
							helperText="Pick things you'd like to see in your home feed"
						/>
					</div>
				</div>
			</div>

			{props.children}
		</Form>
	)
}

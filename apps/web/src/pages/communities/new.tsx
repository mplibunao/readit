import { Badge } from '@/components/Badge'
import {
	Form,
	useZodForm,
	FormInput,
	FormHeading,
	FormTextarea,
	FormCheckbox,
	FormButton,
	FormSelect,
	FormMultiComboBox,
} from '@/components/Forms'
import { Icon } from '@/components/Icon'
import { CheckboxGroup } from '@/components/Input'
import { Layout, MainLayout } from '@/components/Layout'
import { LoadingPage } from '@/components/Spinner'
import { successToast, errorToast } from '@/components/Toast'
import { client } from '@/utils/trpc/client'
import { CommunitySchemas } from '@api/modules/communities/domain/community.schema'
import { useRouter } from 'next/router'

import { NextPageWithLayout } from '../_app'

export const CreateCommunityPage: NextPageWithLayout = (): JSX.Element => {
	const form = useZodForm({
		schema: CommunitySchemas.createCommunityInput,
		defaultValues: { secondaryTags: [], primaryTag: null },
	})
	const { isLoading, data } = client.user.me.useQuery(undefined, {
		staleTime: Infinity,
	})
	const { data: tags } = client.tag.list.useQuery(undefined, {
		staleTime: Infinity,
	})
	const router = useRouter()

	const createCommunityMutation = client.community.createCommunity.useMutation({
		onError: (error) => {
			errorToast({
				title: 'Creating Community Failed',
				message: error.message,
			})
		},
		onSuccess: () => {
			const { name } = form.getValues().community
			successToast({
				title: 'Community Created',
				message: `${name} was created successfully`,
			})
			router.push(`/r/${name}`)
		},
	})

	const handleCreateCommunity = async (
		params: CommunitySchemas.CreateCommunityInput,
	) => {
		createCommunityMutation.mutate(params)
	}

	if (!router.isReady) return <LoadingPage />
	if (isLoading) return <LoadingPage />
	if (!isLoading && !data) router.replace('/login')

	const tagSelect = tags?.map((tag) => {
		return { display: tag.name, value: tag.id }
	})

	return (
		<Form
			className='space-y-8 divide-y divide-neutral-200 px-6 md:px-0'
			form={form}
			onSubmit={handleCreateCommunity}
		>
			<div className='space-y-8 divide-y divide-neutral-200'>
				<div>
					<div>
						<FormHeading title='Create a community' />
					</div>

					<div className='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
						<div className='sm:col-span-4'>
							<FormInput
								type='text'
								name='community.name'
								label='Community name'
								required
								placeholder='FansOfAcme'
								leftAddOn={<span>r/</span>}
								helperText='Community names including capitalization cannot be changed.'
							/>
						</div>

						{tagSelect ? (
							<div className='sm:col-span-4'>
								<FormSelect
									control={form.control}
									label='Primary Topic'
									name='primaryTag'
									options={tagSelect}
									placeholder='Select Primary Topic'
									iconDirection='right'
									selectedOptionIcon={
										<Icon id='check' className='h-5 w-5' hidden />
									}
									helperText='This will help Reddit recommend your community to relevant users and other discovery experiences'
								/>
							</div>
						) : null}

						{tagSelect ? (
							<div className='sm:col-span-4'>
								<FormMultiComboBox
									control={form.control}
									label='Community topics'
									name='secondaryTags'
									options={tagSelect}
									iconDirection='right'
									maxSelected={10}
									selectedOptionIcon={<Icon id='check' className='h-5 w-5' />}
								/>
							</div>
						) : null}

						<div className='sm:col-span-6'>
							<FormTextarea
								label='Community description'
								name='community.description'
								helperText='This is how new members come to understand your community'
							/>
						</div>
					</div>

					<CheckboxGroup label='Adult content' className='mt-2'>
						<FormCheckbox
							name='community.isNsfw'
							label='18+ year old community'
						>
							<Badge color='error' rounded='rounded' className='mr-2'>
								NSFW
							</Badge>
						</FormCheckbox>
					</CheckboxGroup>
				</div>
			</div>

			<div className='pt-5'>
				<div className='flex justify-end'>
					<FormButton
						loadingText='Submitting..'
						loading={createCommunityMutation.isLoading}
					>
						Submit
					</FormButton>
				</div>
			</div>
		</Form>
	)
}

CreateCommunityPage.getLayout = (page) => (
	<Layout>
		<MainLayout bgClass='bg-white'>{page}</MainLayout>
	</Layout>
)

export default CreateCommunityPage

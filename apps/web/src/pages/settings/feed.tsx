import { FormButton } from '@/components/Forms'
import { Layout, MainLayout, SettingsLayout } from '@/components/Layout'
import { LoadingPage } from '@/components/Spinner'
import { errorToast, successToast } from '@/components/Toast'
import { useProtectedPage } from '@/features/accounts/auth'
import {
	UserInterestsForm,
	SettingsSection,
} from '@/features/accounts/settings'
import { client } from '@/utils/trpc/client'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'

import { NextPageWithLayout } from '../_app'

export const FeedSettingsPage: NextPageWithLayout = () => {
	const { router } = useProtectedPage()
	const trpcUtils = client.useContext()
	const { data: userInterests, isLoading: userInterestIsLoading } =
		client.user.getInterests.useQuery(undefined, {
			staleTime: Infinity,
		})
	const { data: tags, isLoading: tagIsLoading } = client.tag.list.useQuery(
		undefined,
		{
			staleTime: Infinity,
		},
	)
	const createAndDeleteUserInterestsMutation =
		client.user.upsertUserInterests.useMutation({
			onError: (error) => {
				errorToast({
					title: 'Updating Interests Failed',
					message: error.message,
				})
			},
			onSuccess: () => {
				trpcUtils.user.getInterests.invalidate()
				successToast({
					title: 'Interests Updated',
					message: 'Your interests were updated successfully',
				})
			},
		})

	if (!router.isReady) return <LoadingPage />
	if (userInterestIsLoading || tagIsLoading) return <LoadingPage />
	if (!userInterests || !tags) {
		return <LoadingPage />
	}

	const handleSubmitInterests = async (
		params: UserSchemas.UpsertUserInterestsInput,
	) => {
		createAndDeleteUserInterestsMutation.mutate(params)
	}

	return (
		<>
			<SettingsSection
				title='Interests'
				subtitle='Choose your interests to get more relevant recommendations'
			>
				<UserInterestsForm
					handleSubmit={handleSubmitInterests}
					tags={tags}
					userInterests={userInterests}
				>
					<div className='mt-4 flex justify-end pt-4 px-4 sm:px-6'>
						<FormButton
							loadingText='Saving..'
							className='rounded-md'
							loading={createAndDeleteUserInterestsMutation.isLoading}
						>
							Save
						</FormButton>
					</div>
				</UserInterestsForm>
			</SettingsSection>
		</>
	)
}

FeedSettingsPage.getLayout = (page) => (
	<Layout>
		<MainLayout bgClass='bg-white'>
			<SettingsLayout>{page}</SettingsLayout>
		</MainLayout>
	</Layout>
)

export default FeedSettingsPage

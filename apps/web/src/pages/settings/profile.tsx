import { Layout, MainLayout, SettingsLayout } from '@/components/Layout'
import { LoadingPage } from '@/components/Spinner'
import { errorToast, successToast } from '@/components/Toast'
import { ProfileForm } from '@/features/accounts/settings'
import { client } from '@/utils/trpc/client'
import { UserDto } from '@api/modules/accounts/dtos/user.dto'
import { useRouter } from 'next/router'
import React from 'react'

import { NextPageWithLayout } from '../_app'

export const SettingsProfile: NextPageWithLayout = (): JSX.Element => {
	const router = useRouter()
	const trpcUtils = client.useContext()

	const { isLoading, data } = client.user.me.useQuery(undefined, {
		staleTime: Infinity,
	})

	const updateProfileMutation = client.user.updateProfile.useMutation({
		onError: (error) => {
			errorToast({
				title: 'Updating Profile Failed',
				message: error.message,
			})
		},
		onSuccess: () => {
			trpcUtils.user.me.invalidate()
			successToast({
				title: 'Success',
				message: 'User profile updated successfully!',
			})
		},
	})

	if (!router.isReady) return <LoadingPage />
	if (isLoading) return <LoadingPage />

	if (!isLoading && !data) {
		router.replace('/login')
	}

	if (data === null) return <LoadingPage />

	const handleUpdateProfile = async (params: UserDto.UpdateProfileInput) => {
		updateProfileMutation.mutate(params)
	}

	return (
		<>
			<ProfileForm
				user={data}
				handleSubmit={handleUpdateProfile}
				isSubmitting={updateProfileMutation.isLoading}
			/>
		</>
	)
}

SettingsProfile.getLayout = (page) => (
	<Layout>
		<MainLayout bgClass='bg-white'>
			<SettingsLayout>{page}</SettingsLayout>
		</MainLayout>
	</Layout>
)

export default SettingsProfile

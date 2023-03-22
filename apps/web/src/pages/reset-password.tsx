import { Card } from '@/components/Card'
import { ErrorPageTemplate } from '@/components/Error'
import { Logo } from '@/components/Icon'
import { PageLayout } from '@/components/Layout'
import { LoadingPage } from '@/components/Spinner'
import { successToast, errorToast } from '@/components/Toast'
import { ResetPasswordForm } from '@/features/accounts/auth/ResetPasswordForm'
import { client } from '@/utils/trpc/client'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import { useRouter } from 'next/router'

import { NextPageWithLayout } from './_app'

export const ResetPasswordPage: NextPageWithLayout = (): JSX.Element => {
	const router = useRouter()
	const trpcUtils = client.useContext()
	const resetPasswordMutation = client.auth.resetPassword.useMutation({
		onError: (error) => {
			errorToast({
				title: 'Failed to change password',
				message: error.message,
			})
		},
		onSuccess: () => {
			successToast({
				title: 'Password successfully changed',
				message: 'Redirecting to home page',
			})
			trpcUtils.user.getStatus.invalidate()
			trpcUtils.user.me.invalidate()
			router.push('/')
		},
	})

	if (!router.isReady) return <LoadingPage />

	const { token } = router.query
	if (typeof token !== 'string') {
		return (
			<ErrorPageTemplate
				height='full'
				code='400'
				title='Reset Password Error'
				message='Invalid forgot password link. Please request a new one'
			/>
		)
	}

	const handleSubmit = (params: UserSchemas.ResetPasswordInput) => {
		resetPasswordMutation.mutate(params)
	}

	return (
		<div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<Logo className='mx-auto' />
				<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900'>
					Change Password
				</h2>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<Card>
					<ResetPasswordForm
						token={token}
						handleSubmit={handleSubmit}
						isSubmitting={resetPasswordMutation.isLoading}
					/>
				</Card>
			</div>
		</div>
	)
}

ResetPasswordPage.getLayout = (page) => <PageLayout>{page}</PageLayout>

export default ResetPasswordPage

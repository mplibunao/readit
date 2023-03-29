import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ErrorPageTemplate } from '@/components/Error'
import { Logo } from '@/components/Icon'
import { PageLayout } from '@/components/Layout'
import { LoadingPage } from '@/components/Spinner'
import { errorToast, successToast } from '@/components/Toast'
import { OAuthRegisterForm } from '@/features/accounts/auth/OAuthRegisterForm'
import { NextPageWithLayout } from '@/pages/_app'
import { client } from '@/utils/trpc/client'
import { OAuthSchemas } from '@api/modules/accounts/domain/oAuth.schema'
import { capitalize } from '@api/utils/string'
import { useRouter } from 'next/router'
import React from 'react'

const providers = ['google', 'discord']

export const OAuthRegister: NextPageWithLayout = (): JSX.Element => {
	const router = useRouter()
	const trpcUtils = client.useContext()
	const { data, isLoading, error } = client.auth.getPartialOAuthUser.useQuery(
		undefined,
		{
			staleTime: Infinity,
		},
	)
	const createUserMutation = client.auth.createOAuthUser.useMutation({
		onError: (error) => {
			errorToast({
				title: 'Failed to create user',
				message: error.message,
			})
		},
		onSuccess: () => {
			successToast({
				title: 'User successfully created',
				message: 'Redirecting to home page',
			})
			trpcUtils.user.me.invalidate()
			router.push('/')
		},
	})

	const clearPartialOAuthUserMutation =
		client.auth.clearPartialOAuthUser.useMutation({
			onError: (error) => {
				errorToast({
					title: 'Failed to clear social details',
					message: error.message,
				})
			},
			onSuccess: () => {
				router.push('/')
			},
		})

	if (!router.isReady) return <LoadingPage />

	const { provider } = router.query
	if (typeof provider !== 'string' || !providers.includes(provider)) {
		return (
			<ErrorPageTemplate
				height='full'
				code='400'
				title='Social Login Failed'
				message='Invalid identity provider'
			/>
		)
	}

	if (isLoading) return <LoadingPage />
	if (error)
		return (
			<ErrorPageTemplate
				height='full'
				code={error.data?.code || '500'}
				title={`${provider} social login failed`}
				message={error.message || 'An error occurred'}
			/>
		)

	const handleSubmit = async (params: OAuthSchemas.CreateOAuthUserInput) => {
		createUserMutation.mutate(params)
	}

	return (
		<div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<Logo className='mx-auto' />
				<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900'>
					Register
				</h2>
				<p className='mt-2 text-center text-sm text-neutral-600'>
					Complete registration with your {capitalize(provider)} account
				</p>
			</div>

			<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
				<Card>
					<OAuthRegisterForm
						partialUser={data}
						handleSubmit={handleSubmit}
						isSubmitting={createUserMutation.isLoading}
					/>

					<div className='mt-6'>
						<div className='relative'>
							<div className='relative flex justify-center text-sm'>
								<Button
									className={'px-2 w-full'}
									intent='ghost'
									loadingText='Going back'
									loading={clearPartialOAuthUserMutation.isLoading}
									onClick={() => clearPartialOAuthUserMutation.mutate()}
								>
									Go back home
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	)
}

OAuthRegister.getLayout = (page) => <PageLayout>{page}</PageLayout>

export default OAuthRegister

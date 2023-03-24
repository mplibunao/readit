import { Card } from '@/components/Card'
import { Form, FormButton, FormInput, useZodForm } from '@/components/Forms'
import { Icon, Logo } from '@/components/Icon'
import { PageLayout } from '@/components/Layout'
import { styledLink } from '@/components/Link'
import { Separator } from '@/components/Separator'
import { errorToast } from '@/components/Toast'
import { OAUTH_URL } from '@/constants/oauth'
import {
	ForgotPasswordEmailModal,
	useVerificationEmail,
} from '@/features/accounts/auth'
import { client } from '@/utils/trpc/client'
import {
	forgotPasswordInput,
	UserSchemas,
} from '@api/modules/accounts/domain/user.schema'
import Link from 'next/link'

import { NextPageWithLayout } from './_app'

export const ForgotPasswordPage: NextPageWithLayout = (): JSX.Element => {
	const forgotPasswordEmailModal = useVerificationEmail()

	const form = useZodForm({
		schema: forgotPasswordInput,
		defaultValues: {
			email: undefined,
			username: undefined,
		},
	})

	const forgotPasswordMutation = client.auth.forgotPassword.useMutation({
		onError: (error) => {
			errorToast({
				title: 'Forgot Password Error',
				message: error.message,
			})
		},
		onSuccess: () => {
			forgotPasswordEmailModal.onOpen()
			forgotPasswordEmailModal.resetResendEmailCooldown()
		},
	})

	const handleResendEmail = () => {
		const formValues = form.getValues()
		forgotPasswordMutation.mutate(formValues)
	}

	const handleForgotPassword = (params: UserSchemas.ForgotPasswordInput) => {
		forgotPasswordMutation.mutate(params)
	}

	return (
		<>
			<ForgotPasswordEmailModal
				isOpen={forgotPasswordEmailModal.isOpen}
				onClose={forgotPasswordEmailModal.onClose}
				handleResendEmail={handleResendEmail}
				remainingTime={forgotPasswordEmailModal.remainingTime}
				allowResendEmail={forgotPasswordEmailModal.allowResendEmail}
			/>
			<div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
				<div className='sm:mx-auto sm:w-full sm:max-w-md'>
					<Logo className='mx-auto' />
					<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900'>
						Forgot Password
					</h2>
					<p className='mt-2 text-center text-sm text-neutral-600'>
						{" Don't have an account? "}
						<Link href='/register' className={styledLink()}>
							Register
						</Link>
					</p>

					<p className='mt-4 text-center text-sm text-neutral-600'>
						Enter your email or password to recieve a password reset link.
					</p>
				</div>

				<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
					<Card>
						<Form
							form={form}
							onSubmit={handleForgotPassword}
							fieldsetProps={{ className: 'space-y-6' }}
						>
							<FormInput
								type='text'
								name='email'
								label='Email'
								placeholder='Enter your email'
							/>

							<FormInput
								type='text'
								name='username'
								label='Username'
								placeholder='Enter your username'
							/>

							<div>
								<FormButton
									className='flex w-full justify-center'
									loadingText='Submitting'
									loading={forgotPasswordMutation.isLoading}
								>
									Submit
								</FormButton>
							</div>
						</Form>

						<div className='mt-6'>
							<div className='relative'>
								<div className='absolute inset-0 flex items-center'>
									<Separator className='w-full border-t border-neutral-300' />
								</div>
								<div className='relative flex justify-center text-sm'>
									<span className='bg-white px-2 text-neutral-500'>
										Or continue with
									</span>
								</div>
							</div>

							<div className='mt-6 flex flex-col space-y-3'>
								<div>
									<Link
										href={OAUTH_URL.google}
										className='inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50'
									>
										<Icon
											id='google'
											className='h-5 w-5 mr-2'
											label='Sign in with Google'
										/>
										Login with Google
									</Link>
								</div>

								<div>
									<Link
										href={OAUTH_URL.discord}
										className='inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50'
									>
										<Icon
											id='discord'
											className='h-5 w-5 mr-2'
											label='Sign in with Discord'
										/>
										Login with Discord
									</Link>
								</div>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</>
	)
}

ForgotPasswordPage.getLayout = (page) => <PageLayout>{page}</PageLayout>

export default ForgotPasswordPage

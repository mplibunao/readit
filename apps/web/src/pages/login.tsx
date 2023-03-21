import { Card } from '@/components/Card'
import { Form, FormButton, FormInput, useZodForm } from '@/components/Forms'
import { Icon, Logo } from '@/components/Icon'
import { styledLink } from '@/components/Link'
import { Separator } from '@/components/Separator'
import { errorToast } from '@/components/Toast'
import { OAUTH_URL } from '@/constants/oauth'
import {
	useLoggedIn,
	useVerificationEmail,
	VerificationEmailModal,
} from '@/features/accounts/auth'
import { client } from '@/utils/trpc/client'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import * as Toggle from '@radix-ui/react-toggle'
import Link from 'next/link'
import React from 'react'

export const Login = (): JSX.Element => {
	useLoggedIn()
	const [showPassword, setShowPassword] = React.useState(false)
	const loginEmailModal = useVerificationEmail()

	const form = useZodForm({ schema: UserSchemas.loginInput })

	const loginMutation = client.auth.login.useMutation({
		onError: (error) => {
			errorToast({
				title: 'Login Failed',
				message: error.message,
			})
		},
		onSuccess() {
			loginEmailModal.onOpen()
			loginEmailModal.resetResendEmailCooldown()
		},
	})

	const handleLogin = async (params: UserSchemas.LoginInput) => {
		loginMutation.mutate(params)
	}

	const handleResendEmail = () => {
		const formValues = form.getValues()
		loginMutation.mutate(formValues)
	}

	return (
		<>
			<VerificationEmailModal
				allowResendEmail={loginEmailModal.allowResendEmail}
				isOpen={loginEmailModal.isOpen}
				onClose={loginEmailModal.onClose}
				handleResendEmail={handleResendEmail}
				remainingTime={loginEmailModal.remainingTime}
			/>
			<div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
				<div className='sm:mx-auto sm:w-full sm:max-w-md'>
					<Logo className='mx-auto' />
					<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900'>
						Login
					</h2>
					<p className='mt-2 text-center text-sm text-neutral-600'>
						{" Don't have an account? "}
						<Link href='/register' className={styledLink()}>
							Register
						</Link>
					</p>
				</div>

				<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
					<Card>
						<Form
							form={form}
							onSubmit={handleLogin}
							fieldsetProps={{ className: 'space-y-6' }}
						>
							<FormInput
								type='text'
								name='usernameOrEmail'
								label='Username or Email'
								required
							/>

							<FormInput
								id='password'
								placeholder='8+ characters, upper/lowercase, numbers'
								label='Password'
								name='password'
								type={showPassword ? 'text' : 'password'}
								autoComplete='current-password'
								required
								classNames={{ rightContent: 'pointer-events-auto' }}
								rightContent={
									<Toggle.Root
										aria-label='Toggle show password'
										pressed={showPassword}
										onPressedChange={() => setShowPassword((prev) => !prev)}
									>
										{showPassword ? (
											<Icon
												id='eye-slash'
												label='hide password'
												className='mr-3 h-5 w-5 text-neutral-400'
												role='img'
											/>
										) : (
											<Icon
												id='eye'
												label='show password'
												className='mr-3 h-5 w-5 text-neutral-400'
												role='img'
											/>
										)}
									</Toggle.Root>
								}
							/>

							<div className='flex items-center justify-between'>
								<div className='text-sm'>
									<Link href='/forgot-password'>Forgot your password?</Link>
								</div>
							</div>

							<div>
								<FormButton
									className='flex w-full justify-center'
									loadingText='Logging in..'
									loading={loginMutation.isLoading}
								>
									Login
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

							<div className='mt-6 grid grid-cols-3 gap-3'>
								<div>
									<Link
										href={OAUTH_URL.facebook}
										className='inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50'
									>
										<Icon
											id='facebook'
											className='h-5 w-5'
											label='Sign in with Facebook'
										/>
									</Link>
								</div>

								<div>
									<Link
										href={OAUTH_URL.google}
										className='inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50'
									>
										<Icon
											id='google'
											className='h-5 w-5'
											label='Sign in with Google'
										/>
									</Link>
								</div>

								<div>
									<Link
										href={OAUTH_URL.discord}
										className='inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50'
									>
										<Icon
											id='discord'
											className='h-5 w-5'
											label='Sign in with Discord'
										/>
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

export default Login

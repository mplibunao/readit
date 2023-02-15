import { Card } from '@/components/Card/Card'
import { Form } from '@/components/Forms/Form'
import { FormButton } from '@/components/Forms/FormButton'
import { FormInput } from '@/components/Forms/FormInput'
import { useZodForm } from '@/components/Forms/useZodForm'
import { Icon } from '@/components/Icon'
import { styledLink } from '@/components/Link/Link'
import { Separator } from '@/components/Separator/Separator'
import { errorToast } from '@/components/Toast/useToast'
import {
	useVerificationEmail,
	VerificationEmailModal,
} from '@/features/accounts/auth/VerificationEmailModal'
import { useLoggedIn } from '@/features/accounts/auth/useLoggedIn'
import { client } from '@/utils/trpc/client'
import {
	IncorrectPassword,
	UserNotFound,
} from '@api/modules/accounts/domain/user.errors'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import * as Toggle from '@radix-ui/react-toggle'
import Link from 'next/link'
import React from 'react'

export const Login = (): JSX.Element => {
	useLoggedIn()
	const [showPassword, setShowPassword] = React.useState(false)
	const loginEmailModal = useVerificationEmail()

	const form = useZodForm({ schema: UserSchemas.loginInput })

	const loginMutation = client.user.login.useMutation({
		onError: (error) => {
			switch (error.data?.type) {
				case IncorrectPassword.type:
				case UserNotFound.type:
					return errorToast({
						title: 'Invalid username, email, or password',
						message: 'Please check your credentials and try again',
					})
				default:
					return errorToast({
						title: 'Login Failed',
						message: 'Something went wrong',
					})
			}
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
					<Icon
						id='reddit'
						className='mx-auto h-12 w-auto text-primary-600'
						label='logo'
					/>
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
											/>
										) : (
											<Icon
												id='eye'
												label='show password'
												className='mr-3 h-5 w-5 text-neutral-400'
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
									loadingText='Signing up'
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
									<a
										href='#'
										className='inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50'
									>
										<Icon
											id='facebook'
											className='h-5 w-5'
											label='Sign in with Facebook'
										/>
									</a>
								</div>

								<div>
									<a
										href='#'
										className='inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50'
									>
										<Icon
											id='google'
											className='h-5 w-5'
											label='Sign in with Google'
										/>
									</a>
								</div>

								<div>
									<a
										href='#'
										className='inline-flex w-full justify-center rounded-md border border-neutral-300 bg-white py-2 px-4 text-sm font-medium text-neutral-500 shadow-sm hover:bg-neutral-50'
									>
										<Icon
											id='twitter'
											className='h-5 w-5'
											label='Sign in with Twitter'
										/>
									</a>
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

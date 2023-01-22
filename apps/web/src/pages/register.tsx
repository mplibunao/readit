import { Card } from '@/components/Card'
import { Form } from '@/components/Forms/Form'
import { FormButton } from '@/components/Forms/FormButton'
import { FormInput } from '@/components/Forms/FormInput'
import { Icon } from '@/components/Icon'
import { styledLink } from '@/components/Link'
import { Separator } from '@/components/Separator'
import { SuccessToast } from '@/components/Toast'
import { useZodForm } from '@/helpers/forms/useZodForm'
import { client } from '@/utils/trpc/client'
import { registerInput } from '@api/modules/accounts/user/user.dto'
import * as Toggle from '@radix-ui/react-toggle'
import Link from 'next/link'
import React from 'react'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

type RegisterInput = z.infer<typeof registerInput>

const Register = () => {
	const [showPassword, setShowPassword] = React.useState(false)
	const form = useZodForm({ schema: registerInput })

	//client.user.register.useMutation({onError})

	const handleRegister = async (_params: RegisterInput) => {
		console.log('_params', _params) // eslint-disable-line no-console
		toast.custom((t) => (
			<SuccessToast
				title='User registered'
				message='User account successfully created'
				toast={t}
			/>
		))
	}

	return (
		<>
			<div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
				<div className='sm:mx-auto sm:w-full sm:max-w-md'>
					<Icon
						id='reddit'
						className='mx-auto h-12 w-auto text-primary-600'
						label='logo'
					/>
					<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900'>
						Sign up
					</h2>
					<p className='mt-2 text-center text-sm text-neutral-600'>
						{' Already have an account? '}
						<Link href='/signin' className={styledLink()}>
							Login
						</Link>
					</p>
				</div>

				<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
					<Card>
						<Form
							form={form}
							onSubmit={handleRegister}
							fieldsetProps={{ className: 'space-y-6' }}
						>
							<FormInput
								type='text'
								name='firstName'
								label='First Name'
								placeholder='John'
								required
							/>

							<FormInput
								type='text'
								name='lastName'
								label='Last Name'
								placeholder='Doe'
								required
							/>

							<FormInput
								type='text'
								name='email'
								label='Email'
								placeholder='Enter your email'
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
									Sign up
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

export default Register

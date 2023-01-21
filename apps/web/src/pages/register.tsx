import { Icon } from '@/components/Icon'
import { styledLink } from '@/components/Link'
//import { useZodForm } from '@/helpers/forms/useZodForm'
//import { registerInput } from '@api/modules/accounts/user/user.dto'
import Link from 'next/link'
import React from 'react'

const Register = () => {
	//const [showPassword, setShowPassword] = React.useState(false)
	//const { register, handleSubmit } = useZodForm({ schema: registerInput })
	return (
		<div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-md'>
				<Icon
					id='reddit'
					className='text-primary-600 mx-auto h-12 w-auto'
					label='logo'
				/>
				<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-neutral-900'>
					Register
				</h2>
				<p className='mt-2 text-center text-sm text-neutral-600'>
					Already have an account?{' '}
					<Link href='/signin' className={styledLink()}>
						Login
					</Link>
				</p>
			</div>
		</div>
	)
}

export default Register

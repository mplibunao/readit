import { Icon } from '@/components/Icon'
import { styledLink } from '@/components/Link'
import Link from 'next/link'

const Register = () => {
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

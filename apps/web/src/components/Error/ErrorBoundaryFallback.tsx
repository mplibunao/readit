import { Button } from '@/components/Button'
import Link from 'next/link'
import { FallbackProps } from 'react-error-boundary'

import { getMailLink, sliceErrorStack } from './utils'

export const ErrorBoundaryFallback = ({
	error,
	resetErrorBoundary,
}: FallbackProps) => {
	return (
		<main className='grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8'>
			<div className='text-center'>
				<h1 className='mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl'>
					An Error Occurred
				</h1>
				<p className='mt-6 text-base leading-7 text-neutral-600'>
					The application detected an error that prevented it from loading. This
					error has been automatically reported to the development team. You can
					try clicking the <strong>Reload the Page</strong> button below to
					return to the page you were on previously.
				</p>
				<div className='mt-10 flex items-center justify-center gap-x-6'>
					<Button
						loadingText=''
						className='rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
						onClick={resetErrorBoundary}
					>
						Reload the Page
					</Button>
					<Link
						href={getMailLink()}
						target='_blank'
						rel='noreferrer'
						className='text-sm font-semibold text-neutral-900'
					>
						Contact support <span aria-hidden='true'>&rarr;</span>
					</Link>
				</div>

				<h2 className='mt-6 text-lg font-bold tracking-tight text-neutral-900 sm:text-2xl'>
					Error Details
				</h2>
				<code className='bg-neutral-100 block rounded-xl m-4 overflow-scroll lg:max--w-3xl md:max-w-xl sm:max-w-lg max-w-xs mx-auto p-4 text-sm'>
					<pre>{error.message}</pre>
				</code>
				<details>
					<summary>Expand to show error stack traces</summary>
					<h3 className='mt-4 text-md font-bold tracking-tight text-neutral-900 sm:text-lg'>
						Stack Trace
					</h3>
					<code className='bg-neutral-100 block rounded-xl m-4 text-left max-h-[25vh] overflow-scroll max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-3xl mx-auto p-4 text-sm'>
						<pre>{sliceErrorStack(error.stack)}</pre>
					</code>
				</details>
			</div>
		</main>
	)
}

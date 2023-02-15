import { isServer } from '@/utils/ssr'
import type { ErrorLayoutProps } from '@api/utils/errors/handleRedirectErrors'
import Link from 'next/link'
import type { FallbackProps } from 'react-error-boundary'

import { Button } from '../Button/Button'

export const ErrorLayout = ({
	title,
	message,
	code,
	supportSubject,
	supportBody,
}: ErrorLayoutProps): JSX.Element => {
	return (
		<main className='grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8'>
			<div className='text-center'>
				<p className='text-base font-semibold text-primary-600'>{code}</p>
				<h1 className='mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl'>
					{title}
				</h1>
				<p className='mt-6 text-base leading-7 text-neutral-600'>{message}</p>
				<div className='mt-10 flex items-center justify-center gap-x-6'>
					<Link
						href='/'
						className='rounded-md bg-primary-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
					>
						Go back home
					</Link>
					<Link
						href={getMailLink({
							subject: supportSubject,
							body: supportBody ?? 'Hi',
						})}
						target='_blank'
						rel='noreferrer'
						className='text-sm font-semibold text-neutral-900'
					>
						Contact support <span aria-hidden='true'>&rarr;</span>
					</Link>
				</div>
			</div>
		</main>
	)
}

const getMailLink = ({
	subject = 'Problem: Unable to load website',
	body,
}: {
	subject?: string
	body?: string
} = {}) => {
	if (isServer()) {
		return `mailto:hello@mplibunao.tech?subject=${encodeURIComponent(subject)}`
	}

	const message =
		body ?? `An error occured while viewing: ${window.location.href}`

	return `mailto:hello@mplibunao.tech?subject=${encodeURIComponent(
		subject,
	)}&body=${encodeURIComponent(message)}`
}

const sliceErrorStack = (stackTrace = '', numLines = 10) => {
	const lines = stackTrace.split('\n')
	const firstNLines = lines.slice(0, numLines)
	const joinedLines = firstNLines.join('\n')
	return joinedLines
}

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
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

				<h2 className='mt-4 text-2xl font-bold tracking-tight text-neutral-900 sm:text-4xl'>
					Error Details
				</h2>
				<code className='p-2 bg-neutral-100 block rounded-xl m-4'>
					<pre>{error.message}</pre>
				</code>
				<details>
					<summary>Expand to show error stack traces</summary>
					<h3 className='mt-4 text-xl font-bold tracking-tight text-neutral-900 sm:text-3xl'>
						Stack Trace
					</h3>
					<code className='p-2 bg-neutral-100 block rounded-xl m-4'>
						<pre>{sliceErrorStack(error.stack)}</pre>
					</code>
				</details>
			</div>
		</main>
	)
}

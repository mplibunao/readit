import type { ErrorLayoutProps } from '@api/utils/errors/handleRedirectErrors'
import { cva, VariantProps } from 'cva'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

import { getMailLink } from './utils'

const wrapper = cva([], {
	variants: {
		height: {
			full: 'min-h-full',
			header: 'min-h-header',
			body: 'min-h-body rounded-lg mr-4 2xl:mr-8 col-span-9 2xl:col-span-10',
		},
	},
	defaultVariants: {
		height: 'body',
	},
})

type WrapperProps = VariantProps<typeof wrapper>

interface ErrorPageTemplateProps extends ErrorLayoutProps, WrapperProps {
	className?: string
}

export const ErrorPageTemplate = ({
	title,
	message,
	code,
	supportSubject,
	supportBody,
	errorJson,
	height = 'body',
	className,
}: ErrorPageTemplateProps): JSX.Element => {
	return (
		<div
			className={twMerge(
				'grid place-items-center px-6 lg:px-8 bg-white py-24 sm:py-32',
				className,
				wrapper({ height }),
			)}
		>
			<div className='text-center'>
				<p className='text-base font-semibold text-primary-600'>{code}</p>
				<h1 className='capitalize mt-4 text-3xl font-bold tracking-tight text-neutral-900 sm:text-5xl'>
					{title}
				</h1>
				<p className='mt-6 text-base leading-7 text-neutral-600'>{message}</p>

				{errorJson ? (
					<div className='grid place-items-center px-6 lg:px-8 w-full mt-4'>
						<code className='bg-neutral-100 block rounded-xl m-4 text-left max-h-[25vh] overflow-scroll max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-3xl mx-auto p-4 text-sm'>
							<pre>{errorJson}</pre>
						</code>
					</div>
				) : null}

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
		</div>
	)
}

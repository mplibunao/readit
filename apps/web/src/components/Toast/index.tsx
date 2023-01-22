import { cva } from 'cva'
import toast, { Toast } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

import { Icon } from '../Icon'

const toastWrapper = cva(
	'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
	{
		variants: {
			visible: {
				true: 'animate-enter',
				false: 'animate-leave',
			},
		},
	},
)

type ToastProps = {
	title?: string
	message: string
	toast: Toast
	className?: string
}
//max-w-md      flex
export const SuccessToast = (props: ToastProps) => {
	return (
		<div
			className={twMerge(
				toastWrapper({ visible: props.toast.visible }),
				props.className,
			)}
		>
			<div className='p-4'>
				<div className='flex items-start'>
					<div className='flex-shrink-0'>
						<Icon
							className='h-6 w-6 text-success-400'
							id='outline-check-circle'
							label='success toast icon'
						/>
					</div>
					<div className='ml-3 w-0 flex-1 pt-0.5'>
						<p className='text-sm font-medium text-gray-900'>{props.title}</p>
						<p className='mt-1 text-sm text-gray-500'>{props.message}</p>
					</div>
					<div className='ml-4 flex flex-shrink-0'>
						<button
							type='button'
							className='inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
							onClick={() => toast.dismiss(props.toast.id)}
						>
							<Icon id='mini-x-mark' className='h-5 w-5' label='close toast' />
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

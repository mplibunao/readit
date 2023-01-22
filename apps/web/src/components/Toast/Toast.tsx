import { cva, VariantProps } from 'cva'
import toast, { Toast } from 'react-hot-toast'
import { twMerge } from 'tailwind-merge'

import { IconButton } from '../Button/IconButton'
import { Icon } from '../Icon'

const toastWrapper = cva(
	'pointer-events-auto w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
	{
		variants: {
			visible: {
				true: 'animate-enter',
				false: 'animate-leave',
			},
			size: {
				xs: 'max-w-xs',
				sm: 'max-w-sm',
				md: 'max-w-md',
				lg: 'max-w-lg',
				xl: 'max-w-xl',
			},
		},
		defaultVariants: {
			size: 'sm',
		},
	},
)

export interface ToastProps
	extends Omit<VariantProps<typeof toastWrapper>, 'visible'> {
	title?: string
	message: string
	toast: Toast
	className?: string
}

export const SuccessToast = (props: ToastProps) => {
	return (
		<div
			className={twMerge(
				toastWrapper({
					visible: props.toast.visible,
					size: props.size,
					className: props.className,
				}),
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
						<p className='text-sm font-medium text-neutral-900'>
							{props.title}
						</p>
						<p className='mt-1 text-sm text-neutral-500'>{props.message}</p>
					</div>
					<div className='ml-4 flex flex-shrink-0'>
						<IconButton
							size='xs'
							className='inline-flex rounded-md bg-white text-neutral-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
							onClick={() => toast.dismiss(props.toast.id)}
						>
							<Icon id='mini-x-mark' className='h-5 w-5' label='close toast' />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	)
}

export const ErrorToast = (props: ToastProps) => {
	return (
		<div
			className={twMerge(
				toastWrapper({
					visible: props.toast.visible,
					size: props.size,
					className: props.className,
				}),
			)}
		>
			<div className='p-4'>
				<div className='flex items-start'>
					<div className='flex-shrink-0'>
						<Icon
							className='h-6 w-6 text-error-400'
							id='exclamation-cicle'
							label='error toast icon'
						/>
					</div>
					<div className='ml-3 w-0 flex-1 pt-0.5'>
						<p className='text-sm font-medium text-neutral-900'>
							{props.title}
						</p>
						<p className='mt-1 text-sm text-neutral-500'>{props.message}</p>
					</div>
					<div className='ml-4 flex flex-shrink-0'>
						<IconButton
							size='xs'
							className='inline-flex rounded-md bg-white text-neutral-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
							onClick={() => toast.dismiss(props.toast.id)}
						>
							<Icon id='mini-x-mark' className='h-5 w-5' label='close toast' />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	)
}

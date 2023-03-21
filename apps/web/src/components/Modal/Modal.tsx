import { Transition, Dialog } from '@headlessui/react'
import { cva, VariantProps } from 'cva'
import React, { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

import { CloseButton as Close, BackButton as Back } from '../Button/IconButton'

export interface BaseModalProps {
	isOpen: boolean
	onClose: () => void
}

export const useDisclosure = () => {
	const [isOpen, setIsOpen] = React.useState(false)
	const onClose = () => setIsOpen(false)
	const onOpen = () => setIsOpen(true)

	return {
		isOpen,
		onClose,
		onOpen,
	}
}

export interface ModalRootProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	initialFocus?: React.MutableRefObject<HTMLElement | null>
}

const Root = ({
	isOpen,
	children,
	onClose,
	initialFocus,
}: ModalRootProps): JSX.Element => {
	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-10'
				onClose={onClose}
				initialFocus={initialFocus}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-100'></div>
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						{children}
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

const modalPanel = cva(
	[
		'relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full',
	],
	{
		variants: {
			maxWidth: {
				sm: 'sm:max-w-sm',
				md: 'sm:max-w-md',
				lg: 'sm:max-w-lg',
				xl: 'sm:max-w-xl',
				'2xl': 'sm:max-w-2xl',
				'3xl': 'sm:max-w-3xl',
				'4xl': 'sm:max-w-4xl',
				'5xl': 'sm:max-w-5xl',
				'6xl': 'sm:max-w-6xl',
			},
			padding: {
				sm: 'sm:p-6 px-4 pb-4 pt-5',
				md: 'py-8 px-4 sm:px-10',
			},
			showOverflow: {
				true: 'overflow-visible',
				false: 'overflow-hidden',
			},
		},
		defaultVariants: {
			maxWidth: 'sm',
			padding: 'sm',
			showOverflow: false,
		},
	},
)

export interface ModalPanelProps extends VariantProps<typeof modalPanel> {
	children: React.ReactNode
	className?: string
}

const Panel = ({ children, className, ...props }: ModalPanelProps) => {
	return (
		<Transition.Child
			as={Fragment}
			enter='ease-out duration-300'
			enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
			enterTo='opacity-100 translate-y-0 sm:scale-100'
			leave='ease-in duration-200'
			leaveFrom='opacity-100 translate-y-0 sm:scale-100'
			leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
		>
			<Dialog.Panel className={twMerge(modalPanel(props), className)}>
				{children}
			</Dialog.Panel>
		</Transition.Child>
	)
}

interface ModalTitleProps {
	children: React.ReactNode
	className?: string
}

const Title = ({ children, className }: ModalTitleProps) => {
	return (
		<Dialog.Title
			as='h3'
			className={twMerge(
				'text-lg font-medium leading-6 text-neutral-900',
				className,
			)}
		>
			{children}
		</Dialog.Title>
	)
}

interface ModalDescriptionProps {
	children: React.ReactNode
	className?: string
}
const Description = ({ children, className }: ModalDescriptionProps) => {
	return (
		<Dialog.Description className={twMerge('mt-2', className)}>
			{children}
		</Dialog.Description>
	)
}

const modalActions = cva(['mt-5'], {
	variants: {
		intent: {
			centerColumns:
				'sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3',
			centerAlign: 'sm:mt-6',
			rightAlign: 'sm:mt-4 sm:flex sm:flex-row-reverse',
			leftAlign: 'sm:mt-4 sm:ml-10 sm:flex sm:pl-4',
		},
	},
	defaultVariants: {
		intent: 'rightAlign',
	},
})

interface ModalActionsProps extends VariantProps<typeof modalActions> {
	children: React.ReactNode
	className?: string
}

const Actions = ({ children, className, intent }: ModalActionsProps) => {
	return (
		<div className={twMerge(modalActions({ intent }), className)}>
			{children}
		</div>
	)
}

interface ModalCloseButtonProps {
	onClose: () => void
}

const CloseButton = ({ onClose }: ModalCloseButtonProps) => {
	return (
		<div className='absolute top-0 right-0 pt-4 pr-4 sm:block'>
			<Close onClick={onClose} />
		</div>
	)
}

interface ModalBackButtonProps {
	onBack: () => void
}

const BackButton = ({ onBack }: ModalBackButtonProps) => {
	return (
		<div className='absolute top-0 left-0 pt-4 pl-4 sm:block'>
			<Back onClick={onBack} iconClass='h-4 w-4' />
		</div>
	)
}

export const Modal = {
	Root,
	Panel,
	Title,
	Description,
	Actions,
	CloseButton,
	BackButton,
}

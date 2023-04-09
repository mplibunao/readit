import { BaseCompoundComponentProps } from '@/utils/types'
import { Dialog, Transition } from '@headlessui/react'
import { VariantProps, cva } from 'cva'
import React from 'react'
import { twMerge } from 'tailwind-merge'

import { CloseButton as Close, BackButton as Back } from '../Button/IconButton'

export * as SlideOver from './SlideOver'

type SlideOverContextType = {
	withFooter?: boolean
	withSubtitle?: boolean
	colorTheme?: 'brandedPrimary' | 'base'
	withBack?: boolean
}

const SlideOverContext = React.createContext<SlideOverContextType>({})

const useSlideOverContext = () => {
	const context = React.useContext(SlideOverContext)

	if (!context) {
		throw new Error(
			`SlideOver compound components cannot be rendered outside the SlideOver component`,
		)
	}

	return context
}

interface SlideOverRootProps extends SlideOverContextType {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	initialFocus?: React.MutableRefObject<HTMLElement | null>
	backgroundOverlay?: boolean
}

export const Root = ({
	children,
	isOpen,
	onClose,
	initialFocus,
	backgroundOverlay,
	withFooter,
	colorTheme,
	withSubtitle,
	withBack,
}: SlideOverRootProps): JSX.Element => {
	return (
		<SlideOverContext.Provider
			value={{ withFooter, colorTheme, withSubtitle, withBack }}
		>
			<Transition.Root show={isOpen} as={React.Fragment}>
				<Dialog
					as='div'
					className='relative z-10'
					onClose={onClose}
					initialFocus={initialFocus}
				>
					{backgroundOverlay ? (
						<Transition.Child
							as={React.Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<div className='fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-100' />
						</Transition.Child>
					) : (
						<div className='fixed inset-0' />
					)}

					<div className='fixed inset-0 overflow-hidden'>
						<div className='absolute inset-0 overflow-hidden'>
							<div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
								{children}
							</div>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</SlideOverContext.Provider>
	)
}

const panelStyle = cva(['pointer-events-auto w-screen'], {
	variants: {
		maxWidth: {
			md: 'max-w-md',
			wide: 'max-w-2xl',
		},
		closeButton: {
			outside: 'relative',
			inside: '',
		},
	},
	defaultVariants: {
		maxWidth: 'md',
		closeButton: 'inside',
	},
})

type PanelProps = VariantProps<typeof panelStyle> & BaseCompoundComponentProps

export const Panel = ({
	children,
	className,
	maxWidth,
	closeButton,
}: PanelProps) => {
	const { withSubtitle, withFooter } = useSlideOverContext()

	return (
		<Transition.Child
			as={React.Fragment}
			enter='transform transition ease-in-out duration-500 sm:duration-700'
			enterFrom='translate-x-full'
			enterTo='translate-x-0'
			leave='transform transition ease-in-out duration-500 sm:duration-700'
			leaveFrom='translate-x-0'
			leaveTo='translate-x-full'
		>
			<Dialog.Panel
				className={twMerge(panelStyle({ className, maxWidth, closeButton }))}
			>
				<div
					className={twMerge(
						'flex h-full flex-col overflow-y-scroll bg-white shadow-xl',
						withSubtitle ? '' : 'py-6',
						withFooter ? 'divide-y divide-neutral-200' : '',
					)}
				>
					{children}
				</div>
			</Dialog.Panel>
		</Transition.Child>
	)
}

export const Body = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	const { withFooter } = useSlideOverContext()
	return withFooter ? (
		<div
			className={twMerge(
				'flex min-h-0 flex-1 flex-col overflow-y-auto',
				className,
			)}
		>
			{children}
		</div>
	) : (
		<>{children}</>
	)
}

type HeaderProps = (
	| {
			withSubtitle: true
			subtitleContainerClassName?: string
			subtitle?: React.ReactNode
	  }
	| {
			withSubtitle?: false
	  }
) &
	BaseCompoundComponentProps

export const Header = ({ className, children, ...props }: HeaderProps) => {
	const { withBack, withFooter } = useSlideOverContext()

	// withSubtitle = true && withFooter = true || false
	if (props.withSubtitle === true) {
		return (
			<div
				className={twMerge(
					'bg-primary-700 px-4',
					props.subtitleContainerClassName,
					withBack ? 'pt-10 pb-6' : 'py-6 sm:px-6',
				)}
			>
				<div
					className={twMerge('flex items-center justify-between', className)}
				>
					{children}
				</div>
				{props.subtitle}
			</div>
		)
	}

	// withFooter = true && withSubtitle = false
	if (withFooter) {
		return (
			<div className='px-4 sm:px-6'>
				<div
					className={twMerge('flex items-center justify-between', className)}
				>
					{children}
				</div>
			</div>
		)
	}

	return (
		<div className='px-4 sm:px-6'>
			<div className={twMerge('flex items-start justify-between', className)}>
				{children}
			</div>
		</div>
	)
}

const titleStyle = cva(['text-base font-semibold leading-6'], {
	variants: {
		colorTheme: {
			base: 'text-neutral-900',
			brandedPrimary: 'text-white',
		},
	},
	defaultVariants: {
		colorTheme: 'base',
	},
})

type TitleProps = BaseCompoundComponentProps

export const Title = ({ children, className }: TitleProps) => {
	const { colorTheme } = useSlideOverContext()
	return (
		<Dialog.Title
			className={twMerge(
				titleStyle({
					className,
					colorTheme,
				}),
			)}
		>
			{children}
		</Dialog.Title>
	)
}

const subtitleStyle = cva(['text-sm'], {
	variants: {
		colorTheme: {
			base: 'text-neutral-500',
			brandedPrimary: 'text-primary-300',
		},
	},
	defaultVariants: {
		colorTheme: 'base',
	},
})

type SubtitleProps = BaseCompoundComponentProps

export const Subtitle = ({ children, className }: SubtitleProps) => {
	const { colorTheme } = useSlideOverContext()
	return (
		<div className='mt-1'>
			<p className={twMerge(subtitleStyle({ className, colorTheme }))}>
				{children}
			</p>
		</div>
	)
}

interface BaseCloseButtonProps {
	onClose: () => void
	className?: string
	iconClass?: string
}

const closeButtonStyles = cva([], {
	variants: {
		colorTheme: {
			base: '',
			brandedPrimary: 'bg-primary-700 text-primary-200 focus:ring-white',
		},
	},
	defaultVariants: {
		colorTheme: 'base',
	},
})

export const CloseButton = ({
	className,
	onClose,
	...props
}: BaseCloseButtonProps) => {
	const { colorTheme } = useSlideOverContext()
	return (
		<div className='ml-3 flex h-7 items-center'>
			<Close
				label='Close panel'
				onClick={onClose}
				className={twMerge(closeButtonStyles({ colorTheme, className }))}
				{...props}
			/>
		</div>
	)
}

export const OutsideCloseButton = (props: BaseCloseButtonProps) => {
	return (
		<Transition.Child
			as={React.Fragment}
			enter='ease-in-out duration-500'
			enterFrom='opacity-0'
			enterTo='opacity-100'
			leave='ease-in-out duration-500'
			leaveFrom='opacity-100'
			leaveTo='opacity-0'
		>
			<div className='absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4'>
				<Close
					label='Close panel'
					className='bg-transparent text-neutral-300 hover:text-white focus:ring-white'
					{...props}
				/>
			</div>
		</Transition.Child>
	)
}

interface BackButtonProps {
	onClick: () => void
	className?: string
	iconClass?: string
}

export const BackButton = ({
	onClick,
	className,
	iconClass,
}: BackButtonProps) => {
	const { colorTheme } = useSlideOverContext()
	return (
		<div className='absolute top-0 left-0 pt-4 pl-4 sm:block'>
			<Back
				onClick={onClick}
				iconClass={twMerge('h-4 w-4', iconClass)}
				className={twMerge(closeButtonStyles({ colorTheme, className }))}
			/>
		</div>
	)
}

export const Content = ({
	children,
	className,
}: BaseCompoundComponentProps) => {
	return (
		<div className={twMerge('relative mt-6 flex-1 px-4 sm:px-6', className)}>
			{children}
		</div>
	)
}

export const Footer = ({ children, className }: BaseCompoundComponentProps) => {
	return (
		<div
			className={twMerge('flex flex-shrink-0 justify-end px-4 py-4', className)}
		>
			{children}
		</div>
	)
}

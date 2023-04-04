import { Dialog, Transition } from '@headlessui/react'
import React from 'react'

export interface SlideOverRootProps {
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
}: SlideOverRootProps): JSX.Element => {
	return (
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
						<div className='fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-100'></div>
					</Transition.Child>
				) : null}
			</Dialog>
		</Transition.Root>
	)
}

export const SlideOver = {
	Root,
}

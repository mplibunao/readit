import React from 'react'

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

import { AnimatePresence, m } from 'framer-motion'
import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { circularButton } from '../Button/CircularButton'
import { Icon } from '../Icon'

const useScrollToTop = () => {
	const [showScroll, setShowScroll] = useState(false)

	const makeScroll = () => {
		window?.scrollTo({ top: 0, behavior: 'smooth' })
	}

	useEffect(() => {
		const checkScroll = () => {
			if (window?.pageYOffset > 400) {
				setShowScroll(true)
			} else if (window?.pageYOffset <= 400) {
				setShowScroll(false)
			}
		}

		document?.addEventListener('scroll', checkScroll)

		return () => document?.removeEventListener('scroll', checkScroll)
	}, [])

	return { makeScroll, showScroll }
}

export const ScrollToTop = () => {
	const { makeScroll, showScroll } = useScrollToTop()

	return (
		<AnimatePresence>
			{showScroll && (
				<m.button
					whileHover={{ scale: 1.1 }}
					initial={{ y: '100vh' }}
					animate={{ y: 0 }}
					exit={{ y: '100vh' }}
					transition={{ duration: 0.3 }}
					className={twMerge(
						'hidden sm:block bottom-5 xl:bottom-16 right-3.5 md:right-5 xl:right-20 fixed z-20 cursor-pointer',
						circularButton({ size: 'sm' }),
					)}
					onClick={makeScroll}
				>
					<Icon
						id='arrow-small-up'
						label='Scroll to top'
						className='xl:w-12 xl:h-12 w-7 h-7 text-white font-bold stroke-2'
					/>
				</m.button>
			)}
		</AnimatePresence>
	)
}

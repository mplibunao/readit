import { Step } from '@/components/Steps'
import { atom, useAtom } from 'jotai'

import { communityRecommendationsAtom } from './useDiscoverCommunities'

export const userInterestModalIsOpenAtom = atom(false)
export const discoverCommunitiesModalIsOpenAtom = atom(false)

export const useUserInterest = () => {
	const [userInterestIsOpen, setUserInterestIsOpen] = useAtom(
		userInterestModalIsOpenAtom,
	)
	const [_discoverCommunitiesIsOpen, setDiscoverCommunitiesIsOpen] = useAtom(
		discoverCommunitiesModalIsOpenAtom,
	)
	const [, setRecommendations] = useAtom(communityRecommendationsAtom)
	const onOpen = () => setUserInterestIsOpen(true)
	const onClose = () => setUserInterestIsOpen(false)
	const onSkip = () => {
		setUserInterestIsOpen(false)
		setDiscoverCommunitiesIsOpen(true)
	}
	const onContinue = () => {
		setUserInterestIsOpen(false)
		setDiscoverCommunitiesIsOpen(true)
	}

	const steps: Step[] = [
		{ name: 'Step 1', href: '#', status: 'current' },
		{ name: 'Step 2', onClick: onContinue, status: 'upcoming' },
	]

	return {
		isOpen: userInterestIsOpen,
		onOpen,
		onClose,
		onSkip,
		onContinue,
		steps,
		setRecommendations,
	}
}

import { Step } from '@/components/Steps'
import { atom, useAtom } from 'jotai'
import { useReducerAtom } from 'jotai/utils'

import {
	communityRecommendationsAtom,
	recommendationsReducer,
	RecommendationAction,
	CommunityRecommendationsState,
} from './useDiscoverCommunities'

export const userInterestModalIsOpenAtom = atom(false)
export const discoverCommunitiesModalIsOpenAtom = atom(false)

export const useUserInterest = () => {
	const [userInterestIsOpen, setUserInterestIsOpen] = useAtom(
		userInterestModalIsOpenAtom,
	)
	const [_discoverCommunitiesIsOpen, setDiscoverCommunitiesIsOpen] = useAtom(
		discoverCommunitiesModalIsOpenAtom,
	)
	const [_, dispatchRecommendations] = useReducerAtom<
		CommunityRecommendationsState,
		RecommendationAction
	>(communityRecommendationsAtom, recommendationsReducer)

	const resetRecommendations = () =>
		dispatchRecommendations({ type: 'RESET', payload: undefined })

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
		resetRecommendations,
	}
}

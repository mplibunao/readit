import { atom, useAtom } from 'jotai'

const userInterestModalIsOpen = atom(true)
const discoverCommunitiesModalIsOpen = atom(false)

export const useUserInterest = () => {
	const [userInterestIsOpen, setUserInterestIsOpen] = useAtom(
		userInterestModalIsOpen,
	)
	const [_discoverCommunitiesIsOpen, setDiscoverCommunitiesIsOpen] = useAtom(
		discoverCommunitiesModalIsOpen,
	)
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

	return {
		isOpen: userInterestIsOpen,
		onOpen,
		onClose,
		onSkip,
		onContinue,
	}
}

export const useDicoverCommunities = () => {
	const [discoverCommunitiesIsOpen, setDiscoverCommunitiesIsOpen] = useAtom(
		discoverCommunitiesModalIsOpen,
	)
	const [_userInterestIsOpen, setUserInterestIsOpen] = useAtom(
		userInterestModalIsOpen,
	)
	const onOpen = () => setDiscoverCommunitiesIsOpen(true)
	const onClose = () => setDiscoverCommunitiesIsOpen(false)
	const onBack = () => {
		setDiscoverCommunitiesIsOpen(false)
		setUserInterestIsOpen(true)
	}
	const onSkip = () => {
		setDiscoverCommunitiesIsOpen(false)
		// check if user.onboardedAt is null
		// if yes, call a mutation to set it to now
	}

	return {
		isOpen: discoverCommunitiesIsOpen,
		onOpen,
		onClose,
		onSkip,
		onBack,
	}
}

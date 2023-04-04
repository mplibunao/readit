import { Step } from '@/components/Steps'
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

	const steps: Step[] = [
		{ name: 'Step 1', onClick: onBack, status: 'complete' },
		{ name: 'Step 2', href: '#', status: 'current' },
	]

	return {
		isOpen: discoverCommunitiesIsOpen,
		onOpen,
		onClose,
		onSkip,
		onBack,
		steps,
	}
}

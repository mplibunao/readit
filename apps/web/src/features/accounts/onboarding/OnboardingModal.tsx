// ~move everything after close button to actions to a separate component~
// ~in here render steps and pass props to the component~

import { DiscoverCommunitiesModal } from './DiscoverCommunitiesModal'
import { UserInterestModal } from './UserInterestModal'

// have a separate modal component for each step
// makes it easier to manage what I want to show
// also have separate hooks for each step
// in terms of state interaction, atoms handle that

export const OnboardingModal = (): JSX.Element => {
	return (
		<>
			<UserInterestModal />
			<DiscoverCommunitiesModal />
		</>
	)
}

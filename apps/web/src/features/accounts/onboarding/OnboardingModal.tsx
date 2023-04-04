import { DiscoverCommunitiesModal } from './DiscoverCommunitiesModal'
import { UserInterestModal } from './UserInterestModal'

export const OnboardingModal = (): JSX.Element => {
	return (
		<>
			<UserInterestModal />
			<DiscoverCommunitiesModal />
		</>
	)
}

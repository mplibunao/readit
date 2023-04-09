import React from 'react'

import { DiscoverCommunitiesModal } from './DiscoverCommunitiesModal'
import { UserInterestModal } from './UserInterestModal'

export const OnboardingModal = ({
	onboardedAt,
}: {
	onboardedAt?: Date | null
}): JSX.Element => {
	return (
		<>
			<UserInterestModal />
			<DiscoverCommunitiesModal onboardedAt={onboardedAt} />
		</>
	)
}

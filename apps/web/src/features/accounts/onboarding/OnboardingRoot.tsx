import { useNav } from '@/components/Navbar'
import { useSidebar } from '@/components/Sidebar'
import { client } from '@/utils/trpc/client'
import { useAtom } from 'jotai'
import dynamic from 'next/dynamic'
import React from 'react'

import {
	userInterestModalIsOpenAtom,
	discoverCommunitiesModalIsOpenAtom,
} from '.'

const DynamicOnboardingModal = dynamic(
	() => import('./OnboardingModal').then((module) => module.OnboardingModal),
	{
		ssr: false,
	},
)

export const OnboardingRoot = (): JSX.Element => {
	const [userInterestIsOpen, setUserInterestIsOpen] = useAtom(
		userInterestModalIsOpenAtom,
	)
	const [discoverCommunitiesIsOpen] = useAtom(
		discoverCommunitiesModalIsOpenAtom,
	)
	const { addItem } = useSidebar()
	const { setNavIsOpen } = useNav()

	React.useEffect(() => {
		addItem(
			{
				id: 'DISCOVER',
				icon: 'compass',
				name: 'Discover Communities',
				onClick: () => {
					setNavIsOpen(false)
					setUserInterestIsOpen(true)
				},
			},
			'YOUR_COMMUNITIES',
		)
	}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const { data: user, isLoading } = client.user.me.useQuery(undefined, {
		onSuccess: (user) => {
			// don't open if 2nd step is open even if user hasn't finished onboarding (query probably got invalidated)
			if (user && !user.onboardedAt && discoverCommunitiesIsOpen === false) {
				setUserInterestIsOpen(true)
			}
		},
	})

	if (isLoading) return <></>
	if (userInterestIsOpen || discoverCommunitiesIsOpen)
		return <DynamicOnboardingModal onboardedAt={user?.onboardedAt} />
	return <></>
}

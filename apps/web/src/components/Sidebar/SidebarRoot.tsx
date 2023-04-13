import { userInterestModalIsOpenAtom } from '@/features/accounts/onboarding'
import { client } from '@/utils/trpc/client'
import { useAtom } from 'jotai'
import React from 'react'

import { MobileSidebar, Sidebar, SidebarItem, useSidebar } from '.'
import { IconId } from '../Icon'
import { useNav } from '../Navbar'

export const SidebarRoot = (): JSX.Element => {
	const { addParent, addChildren } = useSidebar()
	const { setNavIsOpen } = useNav()
	const [, setUserInterestIsOpen] = useAtom(userInterestModalIsOpenAtom)

	const { data: user } = client.user.me.useQuery(undefined, {
		staleTime: Infinity,
	})

	const { data: communities } = client.community.userCommunities.useQuery(
		undefined,
		{ staleTime: Infinity },
	)

	React.useEffect(() => {
		const communityParentItem = user
			? {
					id: 'YOUR_COMMUNITIES',
					name: 'Your Communities',
					children: [
						{
							id: 'CREATE_COMMUNITY',
							icon: 'plus-circle' as IconId,
							name: 'Create Community',
							href: '/communities/new',
						},
						{
							id: 'DISCOVER',
							icon: 'compass' as IconId,
							name: 'Discover Communities',
							onClick: () => {
								setNavIsOpen(false)
								setUserInterestIsOpen(true)
							},
						},
					],
			  }
			: null

		const parentItemWithCommunities =
			communityParentItem?.children && communities && communities.length > 0
				? {
						...communityParentItem,
						children: [
							...communityParentItem.children,
							...communities.map((community) => ({
								id: `MY_COMMUNITIES_${community.id}`,
								name: community.name,
								href: `/r/${community.name}`,
								image: community.imageUrl,
							})),
						],
				  }
				: communityParentItem

		if (parentItemWithCommunities) {
			addParent(parentItemWithCommunities)
		}
	}, [user, communities]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<MobileSidebar />
			<Sidebar />
		</>
	)
}

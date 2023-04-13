import { userInterestModalIsOpenAtom } from '@/features/accounts/onboarding'
import { client } from '@/utils/trpc/client'
import { useAtom } from 'jotai'
import React from 'react'

import { MobileSidebar, Sidebar, useSidebar } from '.'
import { useNav } from '../Navbar'

export const SidebarRoot = (): JSX.Element => {
	const { data: user } = client.user.me.useQuery(undefined, {
		staleTime: Infinity,
	})
	const { addParent } = useSidebar()
	const { setNavIsOpen } = useNav()
	const [, setUserInterestIsOpen] = useAtom(userInterestModalIsOpenAtom)

	React.useEffect(() => {
		if (user) {
			addParent({
				id: 'YOUR_COMMUNITIES',
				name: 'Your Communities',
				children: [
					{
						id: 'CREATE_COMMUNITY',
						icon: 'plus-circle',
						name: 'Create Community',
						href: '/communities/new',
					},
					{
						id: 'DISCOVER',
						icon: 'compass',
						name: 'Discover Communities',
						onClick: () => {
							setNavIsOpen(false)
							setUserInterestIsOpen(true)
						},
					},
				],
			})
		}
	}, [user]) // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			<MobileSidebar />
			<Sidebar />
		</>
	)
}

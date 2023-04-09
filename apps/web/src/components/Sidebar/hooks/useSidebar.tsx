import { atom, useAtom } from 'jotai'

import { SidebarItem } from '../Sidebar'

const sidebarItemsAtom = atom<SidebarItem[]>([
	{
		id: 'FEED',
		name: 'Feed',
		children: [
			{
				id: 'HOME',
				name: 'Home',
				href: '/',
				icon: 'home',
			},
			{
				id: 'POPULAR',
				name: 'Popular',
				href: '/r/popular',
				icon: 'fire',
			},
			{
				id: 'ALL',
				name: 'All',
				href: '/r/all',
				icon: 'user-group',
			},
			{
				id: 'TRENDING',
				name: 'Trending',
				href: '/r/trending',
				icon: 'arrow-trending-up',
			},
		],
	},
	{
		id: 'YOUR_COMMUNITIES',
		name: 'Your Communities',
		children: [
			{
				id: 'CREATE_COMMUNITY',
				icon: 'plus-circle',
				name: 'Create Community',
				href: '/communities/new',
			},
		],
	},
])

export const useSidebar = () => {
	const [sidebarItems, setSidebarItems] = useAtom(sidebarItemsAtom)

	function addItem(item: SidebarItem, key?: string) {
		const newSidebarItems = sidebarItems.map((sidebarItem) => {
			if (sidebarItem.id === (key ?? item.id)) {
				const sidebarItemChildren = sidebarItem.children ?? []

				// duplicate children with the same id
				if (sidebarItemChildren.some((child) => child.id === item.id)) {
					return sidebarItem
				}

				return {
					...sidebarItem,
					children: [...sidebarItemChildren, item],
				}
			} else {
				return sidebarItem
			}
		})

		setSidebarItems(newSidebarItems)
	}

	return { sidebarItems, addItem }
}

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
])

export const useSidebar = () => {
	const [sidebarItems, setSidebarItems] = useAtom(sidebarItemsAtom)
	console.info(sidebarItems, 'sidebarItems')

	function addChild(item: SidebarItem, parentKey: string) {
		const newSidebarItems = sidebarItems.map((sidebarItem) => {
			if (sidebarItem.id === parentKey) {
				if (!sidebarItem.children) {
					sidebarItem.children = [item]
					return sidebarItem
				}

				// duplicate children with the same id
				if (sidebarItem.children.some((child) => child.id === item.id)) {
					return sidebarItem
				}

				sidebarItem.children.push(item)
				return sidebarItem
			} else {
				return sidebarItem
			}
		})

		setSidebarItems(newSidebarItems)
	}

	function addChildren(item: SidebarItem[], parentKey: string) {
		const newSidebarItems = sidebarItems.map((sidebarItem) => {
			if (sidebarItem.id === parentKey) {
				if (!sidebarItem.children) {
					sidebarItem.children = item
					return sidebarItem
				}

				// duplicate children with the same id
				if (sidebarItem.children.some((child) => child.id === item.id)) {
					return sidebarItem
				}

				sidebarItem.children.concat(item)
				return sidebarItem
			} else {
				return sidebarItem
			}
		})

		setSidebarItems(newSidebarItems)
	}

	function addParent(item: SidebarItem) {
		const existingParent = sidebarItems.find(
			(sidebarItem) => sidebarItem.id === item.id,
		)

		if (existingParent) {
			return
		}

		setSidebarItems((prev) => [...prev, item])
	}

	return { sidebarItems, addChild, addParent, addChildren }
}

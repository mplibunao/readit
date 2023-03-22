import { IconId } from '@/components/Icon/types'

type Navigation = Array<{
	name: string
	href: string
	icon: IconId
	label: string
}>

export const navigation: Navigation = [
	{
		name: 'Home',
		href: '/',
		icon: 'home',
		label: 'Navigate to home page',
	},
	{
		name: 'Popular',
		href: '/r/popular',
		icon: 'fire',
		label: 'View popular posts',
	},
	{
		name: 'All',
		href: '/r/all',
		icon: 'user-group',
		label: 'View posts from all communities',
	},
	{
		name: 'Trending',
		href: '/r/trending',
		icon: 'arrow-trending-up',
		label: 'View trending posts',
	},
]

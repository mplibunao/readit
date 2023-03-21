import { Story } from '@ladle/react'
import Link from 'next/link'
import React from 'react'

import { Banner, BannerContent, BannerProps } from './Banner'

type StoryBannerProps = Omit<BannerProps, 'children' | 'onClose'>
const argTypes = {
	color: {
		options: ['dark', 'primary'],
		control: { type: 'radio' },
		defaultValue: 'dark',
	},
}

export const Default: Story<StoryBannerProps> = (props) => {
	const [banners, setBanners] = React.useState([
		{
			children: (
				<Link href='#'>
					<BannerContent
						description='Join us in Denver from June 7 – 9 to see what’s coming next'
						title='GeneriCon 2023'
					/>
				</Link>
			),
			id: 'basic',
		},
	])
	const onClose = (id: string) => setBanners(banners.filter((b) => b.id !== id))

	return (
		<div className='min-h-full'>
			{banners.map((banner) => (
				<Banner key={banner.id} onClose={() => onClose(banner.id)} {...props}>
					{banner.children}
				</Banner>
			))}
		</div>
	)
}
Default.argTypes = argTypes

export const Stacked: Story<StoryBannerProps> = (props) => {
	const [banners, setBanners] = React.useState([
		{
			children: (
				<BannerContent
					description='Join us in Denver from June 7 – 9 to see what’s coming next'
					title='GeneriCon 2023'
				/>
			),
			id: 'basic',
		},
		{
			children: (
				<BannerContent
					description='Join us in Denver from June 7 – 9 to see what’s coming next'
					title='GeneriCon 2023'
				/>
			),
			id: 'basic1',
		},
	])
	const onClose = (id: string) => setBanners(banners.filter((b) => b.id !== id))
	return (
		<div className='min-h-full'>
			{banners.map((banner) => (
				<Banner key={banner.id} onClose={() => onClose(banner.id)} {...props}>
					{banner.children}
				</Banner>
			))}
		</div>
	)
}
Stacked.argTypes = argTypes

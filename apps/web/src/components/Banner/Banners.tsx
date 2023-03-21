import { client } from '@/utils/trpc/client'
import Link from 'next/link'

import { Banner, BannerContent } from './Banner'
import { useBanner } from './useBanner'

export const Banners = (): JSX.Element => {
	const { banners, removeBanner, addBanner } = useBanner()
	client.user.me.useQuery(undefined, {
		staleTime: Infinity,
		onSuccess: (data) => {
			if (data && !data?.confirmedAt) {
				addBanner({
					children: (
						<Link href='/settings?confirm-email=open'>
							<BannerContent
								description='Please confirm your email address to get full access to your account'
								title='Resend confirmation email'
							/>
						</Link>
					),
					id: 'unconfirmed-email',
				})
			}
		},
	})
	return (
		<>
			{banners.map((banner) => (
				<Banner key={banner.id} onClose={() => removeBanner(banner.id)}>
					{banner.children}
				</Banner>
			))}
		</>
	)
}

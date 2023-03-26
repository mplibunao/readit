import { client } from '@/utils/trpc/client'
import dynamic from 'next/dynamic'

const DynamicOnboardingModal = dynamic(
	() => import('./OnboardingModal').then((module) => module.OnboardingModal),
	{
		ssr: false,
	},
)

export const OnboardingRoot = (): JSX.Element => {
	const { data: user } = client.user.me.useQuery()
	if (user?.onboardedAt) return <></>
	return <DynamicOnboardingModal />
}
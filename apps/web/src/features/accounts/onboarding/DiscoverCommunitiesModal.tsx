import { Circle } from '@/components/Banner'
import { Button } from '@/components/Button'
import { SlideOver } from '@/components/Modal/SlideOver'
import { Spinner } from '@/components/Spinner'
import { BulletSteps } from '@/components/Steps'
import { client } from '@/utils/trpc/client'

import { useDicoverCommunities } from '.'
import { CommunityRecommendationList } from './CommunityRecommendationList'

const descriptions = [
	'Discover communities that interest you',
	'Press Skip to stop this modal from popping up.',
	'You can access this in the future from the the Discover Communities button on the Sidebar',
]

export const DiscoverCommunitiesModal = ({
	onboardedAt,
}: {
	onboardedAt?: Date | null
}): JSX.Element => {
	const {
		isOpen,
		onClose,
		onBack,
		steps,
		onSkip,
		setRecommendations,
		selectedCommunities,
		handleFinishOnboarding,
		recommendationNumber,
	} = useDicoverCommunities()

	const { isLoading, data } =
		client.recommendation.getRecommendedCommunities.useQuery(
			recommendationNumber,
			{
				enabled: isOpen,
				staleTime: Infinity,
				onSuccess: (data) => {
					setRecommendations(data)
				},
			},
		)

	const joinCommunitiesMutation = client.community.joinCommunities.useMutation({
		onSuccess: () => {
			handleFinishOnboarding()
		},
	})
	return (
		<SlideOver.Root
			isOpen={isOpen}
			onClose={onClose}
			withFooter
			withSubtitle
			colorTheme='brandedPrimary'
			withBack
		>
			<SlideOver.Panel maxWidth='wide'>
				<SlideOver.Body>
					<SlideOver.Header
						withSubtitle
						subtitle={descriptions.map((description, index) => (
							<SlideOver.Subtitle key={index} className='text-xs sm:text-base'>
								<Circle className='mr-1' /> {description}
							</SlideOver.Subtitle>
						))}
					>
						<SlideOver.BackButton onClick={onBack} />
						<SlideOver.Title className='text-lg'>
							Discover Communities
						</SlideOver.Title>
						<SlideOver.CloseButton onClose={onClose} />
					</SlideOver.Header>

					<div className='mx-auto flex items-center justify-center py-4'>
						<BulletSteps steps={steps} />
					</div>

					{isLoading || !data ? (
						<div className='mt-4 sm:mt-5 flex justify-center'>
							<Spinner />
						</div>
					) : (
						<CommunityRecommendationList />
					)}
				</SlideOver.Body>

				<SlideOver.Footer>
					<Button
						loadingText='Skipping'
						className='mt-3 inline-flex w-full sm:mt-0 sm:w-auto ml-4'
						intent='outline'
						color='neutral'
						onClick={() => onSkip(onboardedAt)}
					>
						Skip
					</Button>

					<Button
						loadingText='Submitting'
						className='mt-3 inline-flex w-full sm:mt-0 sm:w-auto ml-4'
						onClick={() => {
							joinCommunitiesMutation.mutate(
								Array.from(selectedCommunities.keys()),
							)
						}}
					>
						Submit
					</Button>
				</SlideOver.Footer>
			</SlideOver.Panel>
		</SlideOver.Root>
	)
}

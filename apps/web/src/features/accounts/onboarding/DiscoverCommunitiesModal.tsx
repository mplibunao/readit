import { Circle } from '@/components/Banner'
import { Modal } from '@/components/Modal'
import { Spinner } from '@/components/Spinner'
import { BulletSteps } from '@/components/Steps'
import { client } from '@/utils/trpc/client'

import { CommunityRecommendationList } from './CommunityRecommendationList'
import { useDicoverCommunities } from './onboardingHooks'

const descriptions = [
	'Discover communities that interest you',
	'Press Skip to stop this modal from popping up.',
	'You can access this in the future from the the Discover Communities button on the Sidebar',
]

export const DiscoverCommunitiesModal = (): JSX.Element => {
	const { isOpen, onClose, onBack, steps } = useDicoverCommunities()
	//const trpcUtils = client.useContext()
	const { isLoading, data } =
		client.recommendation.getRecommendedCommunities.useQuery(undefined, {
			enabled: isOpen,
		})

	console.info(data, 'recommendations')
	return (
		<Modal.Root isOpen={isOpen} onClose={onClose}>
			<Modal.Panel maxWidth='lg' padding='md'>
				<Modal.CloseButton onClose={onClose} />
				<Modal.BackButton onBack={onBack} />
				<div>
					<div className='mx-auto flex items-center justify-center py-4'>
						<BulletSteps steps={steps} />
					</div>

					{isLoading || !data ? (
						<div className='mt-4 sm:mt-5 flex justify-center'>
							<Spinner />
						</div>
					) : (
						<div className='mt-4 sm:mt-5'>
							<Modal.Title>Discover Communities</Modal.Title>
							<Modal.Description>
								<span className='text-sm text-neutral-500 flex flex-col space-y-1'>
									{descriptions.map((description, index) => (
										<span key={index}>
											<Circle className='mr-1' /> {description}
										</span>
									))}
								</span>
							</Modal.Description>
							<CommunityRecommendationList recommendations={data} />
						</div>
					)}
				</div>
			</Modal.Panel>
		</Modal.Root>
	)
}

import { Circle } from '@/components/Banner'
//import { IconButton } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { BulletSteps } from '@/components/Steps'

//import { client } from '@/utils/trpc/client'

import { useDicoverCommunities } from './onboardingHooks'

const descriptions = [
	'Discover communities that interest you',
	'Press Skip to stop this modal from popping up.',
	'You can access this in the future from the the Discover Communities button on the Sidebar',
]

export const DiscoverCommunitiesModal = (): JSX.Element => {
	const { isOpen, onClose, onBack } = useDicoverCommunities()
	//const trpcUtils = client.useContext()

	return (
		<Modal.Root isOpen={isOpen} onClose={onClose}>
			<Modal.Panel maxWidth='lg' padding='md'>
				<Modal.CloseButton onClose={onClose} />
				<Modal.BackButton onBack={onBack} />
				<div>
					<div className='mx-auto flex items-center justify-center py-4'>
						<BulletSteps />
					</div>

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
					</div>
				</div>
			</Modal.Panel>
		</Modal.Root>
	)
}

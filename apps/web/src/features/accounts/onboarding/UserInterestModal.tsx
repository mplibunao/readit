import { Circle } from '@/components/Banner'
import { Button } from '@/components/Button'
import { FormButton } from '@/components/Forms'
import { SlideOver } from '@/components/Modal/SlideOver'
import { BulletSteps } from '@/components/Steps'
import { errorToast, successToast } from '@/components/Toast'
import { client } from '@/utils/trpc/client'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'

import { useUserInterest } from '.'
import { UserInterestsForm } from '../settings'

const descriptions = [
	'Choose your interests to get more relevant recommendations.',
	'Press Skip to stop this modal from popping up.',
	'You can access this in the future either from the Settings Page or the Discover Communities button on the Sidebar',
]

export const UserInterestModal = (): JSX.Element => {
	const { isOpen, onClose, onSkip, onContinue, steps, resetRecommendations } =
		useUserInterest()
	const trpcUtils = client.useContext()

	const { data: tags } = client.tag.list.useQuery(undefined, {
		staleTime: Infinity,
	})

	const { data: userInterests } = client.user.getInterests.useQuery(undefined, {
		staleTime: Infinity,
	})

	const createAndDeleteUserInterestsMutation =
		client.user.upsertUserInterests.useMutation({
			onError: (error) => {
				errorToast({
					title: 'Updating Interests Failed',
					message: error.message,
				})
			},
			onSuccess: () => {
				trpcUtils.user.getInterests.invalidate()
				resetRecommendations()
				// if user uses back and updates interests
				trpcUtils.recommendation.getRecommendedCommunities.invalidate()
				successToast({
					title: 'Interests Updated',
					message: 'Your interests were updated successfully',
				})
				onContinue()
			},
		})

	if (!userInterests || !tags) {
		return <></>
	}

	const handleSubmitInterests = async (
		params: UserSchemas.UpsertUserInterestsInput,
	) => {
		createAndDeleteUserInterestsMutation.mutate(params)
	}

	return (
		<SlideOver.Root
			isOpen={isOpen}
			onClose={onClose}
			withFooter
			withSubtitle
			colorTheme='brandedPrimary'
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
						<SlideOver.Title className='text-lg'>Interests</SlideOver.Title>
						<SlideOver.CloseButton onClose={onClose} />
					</SlideOver.Header>

					<div className='mx-auto flex items-center justify-center py-4'>
						<BulletSteps steps={steps} />
					</div>

					<div className='px-4 sm:px-6'>
						<UserInterestsForm
							handleSubmit={handleSubmitInterests}
							tags={tags}
							userInterests={userInterests}
						>
							<SlideOver.Footer className='mt-3'>
								<Button
									loadingText='Skipping'
									className='mt-3 inline-flex w-full sm:mt-0 sm:w-auto ml-4'
									intent='outline'
									color='neutral'
									onClick={onSkip}
								>
									Skip
								</Button>

								<FormButton
									loadingText='Saving'
									className='inline-flex w-full justify-center rounded-md sm:ml-3 sm:w-auto'
									loading={createAndDeleteUserInterestsMutation.isLoading}
								>
									Continue
								</FormButton>
							</SlideOver.Footer>
						</UserInterestsForm>
					</div>
				</SlideOver.Body>
			</SlideOver.Panel>
		</SlideOver.Root>
	)
}

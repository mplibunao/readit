import { Circle } from '@/components/Banner'
import { Button } from '@/components/Button'
import { FormButton } from '@/components/Forms'
import { Modal } from '@/components/Modal'
import { BulletSteps } from '@/components/Steps'
import { errorToast, successToast } from '@/components/Toast'
import { client } from '@/utils/trpc/client'
import { UserSchemas } from '@api/modules/accounts/domain/user.schema'

import { UserInterestsForm } from '../settings'
import { useUserInterest } from './onboardingHooks'

const descriptions = [
	'Choose your interests to get more relevant recommendations.',
	'Press Skip to stop this modal from popping up.',
	'You can access this in the future either from the Settings Page or the Discover Communities button on the Sidebar',
]

export const UserInterestModal = (): JSX.Element => {
	const { isOpen, onClose, onSkip, onContinue, steps } = useUserInterest()
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
		<Modal.Root isOpen={isOpen} onClose={onClose}>
			<Modal.Panel maxWidth='lg' padding='md' showOverflow>
				<Modal.CloseButton onClose={onClose} />

				<div>
					<div className='mx-auto flex items-center justify-center py-4'>
						<BulletSteps steps={steps} />
					</div>

					<div className='mt-4 sm:mt-5'>
						<Modal.Title>Interests</Modal.Title>
						<Modal.Description>
							<span className='text-sm text-neutral-500 flex flex-col space-y-1'>
								{descriptions.map((description, index) => (
									<span key={index}>
										<Circle className='mr-1' /> {description}
									</span>
								))}
							</span>
						</Modal.Description>
						<UserInterestsForm
							handleSubmit={handleSubmitInterests}
							tags={tags}
							userInterests={userInterests}
						>
							<Modal.Actions>
								<FormButton
									loadingText='Saving'
									className='inline-flex w-full justify-center rounded-md sm:ml-3 sm:w-auto'
									loading={createAndDeleteUserInterestsMutation.isLoading}
								>
									Continue
								</FormButton>

								<Button
									loadingText='Skipping'
									className='mt-3 inline-flex w-full sm:mt-0 sm:w-auto'
									intent='outline'
									color='neutral'
									onClick={onSkip}
								>
									Skip
								</Button>
							</Modal.Actions>
						</UserInterestsForm>
					</div>
				</div>
			</Modal.Panel>
		</Modal.Root>
	)
}

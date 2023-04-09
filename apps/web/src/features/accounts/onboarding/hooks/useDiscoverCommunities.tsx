import { Step } from '@/components/Steps'
import { errorToast, successToast } from '@/components/Toast'
import { client } from '@/utils/trpc/client'
import { RecommendationSchemas } from '@api/modules/recommendations/domain/recommendation.schema'
import { atom, useAtom } from 'jotai'

import {
	discoverCommunitiesModalIsOpenAtom,
	userInterestModalIsOpenAtom,
} from './useUserInterest'

export const communityRecommendationsAtom =
	atom<RecommendationSchemas.CommunityRecommendations>({})

export type ToggleCommunityRecommendationProps = {
	tagId: string
	communityId: string
	selected: boolean
}

export const useDicoverCommunities = () => {
	const [discoverCommunitiesIsOpen, setDiscoverCommunitiesIsOpen] = useAtom(
		discoverCommunitiesModalIsOpenAtom,
	)
	const [, setUserInterestIsOpen] = useAtom(userInterestModalIsOpenAtom)
	const [recommendations, setRecommendations] = useAtom(
		communityRecommendationsAtom,
	)
	const finishOnboarding = client.user.finishOnboarding.useMutation({
		onError: (error) => {
			errorToast({
				title: 'Failed to finish onboarding process',
				message: error.message,
			})
		},
		onSuccess: () => {
			successToast({
				title: 'Successfully finished onboarding rprocess',
				message: 'You can come back and update this later',
			})
			setDiscoverCommunitiesIsOpen(false)
		},
	})
	const onOpen = () => setDiscoverCommunitiesIsOpen(true)
	const onClose = () => setDiscoverCommunitiesIsOpen(false)
	const onBack = () => {
		setDiscoverCommunitiesIsOpen(false)
		setUserInterestIsOpen(true)
	}
	const onSkip = (onboardedAt?: Date | null) => {
		if (!onboardedAt) {
			finishOnboarding.mutate()
		} else {
			setDiscoverCommunitiesIsOpen(false)
		}
	}

	const tagCommunitiesAllSelected = (
		tag: RecommendationSchemas.CommunityRecommendationsTag,
	) => tag.communities.every((community) => community.selected)

	const tagCommunitiesAllUnselected = (
		tag: RecommendationSchemas.CommunityRecommendationsTag,
	) => tag.communities.every((community) => !community.selected)

	const toggleRecommendation = ({
		tagId,
		communityId,
		selected,
	}: ToggleCommunityRecommendationProps) => {
		const tag = recommendations[tagId]
		if (!tag) return
		const community = tag.communities.find(
			(community) => community.id === communityId,
		)

		if (community) {
			const newCommunities = tag.communities.map((community) => {
				if (community.id === communityId) {
					return { ...community, selected }
				}
				return community
			})
			const updatedTag = {
				...tag,
				communities: newCommunities,
			}
			setRecommendations({
				...recommendations,
				[tagId]: {
					...updatedTag,
					allSelected: tagCommunitiesAllSelected(updatedTag),
					allUnselected: tagCommunitiesAllUnselected(updatedTag),
				},
			})
		}
	}

	const toggleSelectAllTagCommunities = (newValue: boolean, tagId: string) => {
		if (newValue) {
			selectAllTagCommunities(tagId)
		} else {
			deselectAllTagCommunities(tagId)
		}
	}

	const selectAllTagCommunities = (tagId: string) => {
		const tag = recommendations[tagId]
		if (!tag) return

		const newRecommendations = {
			...recommendations,
			[tagId]: {
				...tag,
				allSelected: true,
				allUnselected: false,
				communities: tag.communities.map((community) => ({
					...community,
					selected: true,
				})),
			},
		}

		setRecommendations(newRecommendations)
	}

	const deselectAllTagCommunities = (tagId: string) => {
		const tag = recommendations[tagId]
		if (!tag) return

		const newRecommendations = {
			...recommendations,
			[tagId]: {
				...tag,
				allSelected: false,
				allUnselected: true,
				communities: tag.communities.map((community) => ({
					...community,
					selected: false,
				})),
			},
		}

		setRecommendations(newRecommendations)
	}

	const steps: Step[] = [
		{ name: 'Step 1', onClick: onBack, status: 'complete' },
		{ name: 'Step 2', href: '#', status: 'current' },
	]

	return {
		isOpen: discoverCommunitiesIsOpen,
		onOpen,
		onClose,
		onSkip,
		onBack,
		steps,
		recommendations,
		setRecommendations,
		toggleRecommendation,
		toggleSelectAllTagCommunities,
	}
}

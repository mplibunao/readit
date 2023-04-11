import { Step } from '@/components/Steps'
import { errorToast, successToast } from '@/components/Toast'
import { client } from '@/utils/trpc/client'
import { RecommendationSchemas } from '@api/modules/recommendations/domain/recommendation.schema'
import { atom, useAtom } from 'jotai'
import { useReducerAtom } from 'jotai/utils'

import {
	discoverCommunitiesModalIsOpenAtom,
	userInterestModalIsOpenAtom,
} from './useUserInterest'

const recommendationNumber = 5

export type CommunityRecommendationsState = {
	recommendations: RecommendationSchemas.CommunityRecommendations
	selected: Map<string, boolean>
}

export const communityRecommendationsAtom = atom<CommunityRecommendationsState>(
	{
		recommendations: new Map(),
		selected: new Map(),
	},
)

export type RecommendationAction =
	| {
			type: 'SET_RECOMMENDATIONS'
			payload: RecommendationSchemas.CommunityRecommendations
	  }
	| {
			type: 'TOGGLE_COMMUNITY_RECOMMENDATION'
			payload: ToggleCommunityRecommendationProps
	  }
	| {
			type: 'ADD_TAG_RECOMMENDED_COMMUNITIES'
			payload: RecommendationSchemas.GetMoreRecommendedCommunitiesOutput
	  }
	| { type: 'SELECT_ALL_TAG_COMMUNITIES'; payload: string }
	| { type: 'DESELECT_ALL_TAG_COMMUNITIES'; payload: string }
	| { type: 'RESET'; payload: undefined }

export const recommendationsReducer = (
	state: CommunityRecommendationsState,
	{ payload, type }: RecommendationAction,
) => {
	switch (type) {
		case 'RESET':
			return {
				recommendations: new Map(),
				selected: new Map(),
			}
		case 'SET_RECOMMENDATIONS':
			return {
				...state,
				recommendations: payload,
			}
		case 'TOGGLE_COMMUNITY_RECOMMENDATION': {
			const recommendation = state.recommendations.get(payload.tagId)
			if (!recommendation) return state

			const selected = new Map(state.selected)
			payload.selected
				? selected.set(payload.communityId, true)
				: selected.delete(payload.communityId)

			const newRecommendation = {
				...recommendation,
				allSelected: recommendation.communities.every((community) =>
					selected.has(community.id),
				),
				allUnselected: recommendation.communities.every(
					(community) => !selected.has(community.id),
				),
			}

			return {
				selected,
				recommendations: new Map(state.recommendations).set(
					payload.tagId,
					newRecommendation,
				),
			}
		}
		case 'ADD_TAG_RECOMMENDED_COMMUNITIES': {
			const recommendation = state.recommendations.get(payload.tagId)
			if (!recommendation) return state
			if (payload.communities.length === 0) {
				successToast({
					title: 'No more recommendations for this category',
					message: 'Try another one or change your interest',
				})
			}

			const newRecommendation =
				payload.communities.length === 0
					? {
							...recommendation,
							noMoreCommunities: true,
					  }
					: {
							...recommendation,
							communities: [
								...recommendation.communities,
								...payload.communities,
							],
					  }

			return {
				...state,
				recommendations: new Map(state.recommendations).set(
					payload.tagId,
					newRecommendation,
				),
			}
		}
		case 'SELECT_ALL_TAG_COMMUNITIES': {
			const recommendation = state.recommendations.get(payload)
			if (!recommendation) return state

			const newRecommendation = {
				...recommendation,
				allSelected: true,
				allUnselected: false,
			}

			return {
				selected: recommendation.communities.reduce<Map<string, boolean>>(
					(acc, community) => {
						acc.set(community.id, true)
						return acc
					},
					state.selected,
				),
				recommendations: new Map(state.recommendations).set(
					payload,
					newRecommendation,
				),
			}
		}
		case 'DESELECT_ALL_TAG_COMMUNITIES': {
			const recommendation = state.recommendations.get(payload)
			if (!recommendation) return state

			const newRecommendation = {
				...recommendation,
				allSelected: false,
				allUnselected: true,
			}

			return {
				recommendations: new Map(state.recommendations).set(
					payload,
					newRecommendation,
				),
				selected: recommendation.communities.reduce<Map<string, boolean>>(
					(acc, community) => {
						acc.delete(community.id)
						return acc
					},
					state.selected,
				),
			}
		}
	}
}

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

	const [
		{ recommendations, selected: selectedCommunities },
		dispatchRecommendations,
	] = useReducerAtom<CommunityRecommendationsState, RecommendationAction>(
		communityRecommendationsAtom,
		recommendationsReducer,
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
				title: 'Successfully finished onboarding process',
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

	const handleFinishOnboarding = () => finishOnboarding.mutate()

	const setRecommendations = (
		recommendations: RecommendationSchemas.CommunityRecommendations,
	) => {
		dispatchRecommendations({
			type: 'SET_RECOMMENDATIONS',
			payload: recommendations,
		})
	}

	const toggleCommunityRecommendation = (
		payload: ToggleCommunityRecommendationProps,
	) => {
		dispatchRecommendations({
			type: 'TOGGLE_COMMUNITY_RECOMMENDATION',
			payload,
		})
	}

	const addTagRecommendedCommunities = (
		recommendedCommunities: RecommendationSchemas.GetMoreRecommendedCommunitiesOutput,
	) => {
		dispatchRecommendations({
			type: 'ADD_TAG_RECOMMENDED_COMMUNITIES',
			payload: recommendedCommunities,
		})
	}

	const selectAllTagCommunities = (tagId: string) => {
		dispatchRecommendations({
			type: 'SELECT_ALL_TAG_COMMUNITIES',
			payload: tagId,
		})
	}

	const deselectAllTagCommunities = (tagId: string) => {
		dispatchRecommendations({
			type: 'DESELECT_ALL_TAG_COMMUNITIES',
			payload: tagId,
		})
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
		toggleCommunityRecommendation,
		selectedCommunities,
		handleFinishOnboarding,
		recommendationNumber,
		addTagRecommendedCommunities,
		selectAllTagCommunities,
		deselectAllTagCommunities,
	}
}

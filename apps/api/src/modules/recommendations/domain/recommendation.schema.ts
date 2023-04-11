import { z } from 'zod'

import {
	getMoreRecommendedCommunitiesProcedure,
	getRecommendedCommunitiesProcedure,
} from '../dtos/recommendation.dto'

export * as RecommendationSchemas from './recommendation.schema'

export const recommendationCommunity = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string().nullable(),
	imageUrl: z.string().nullable(),
	numCommonTags: z.number().positive(),
	rank: z.number().positive(),
})
export const communityRecommendation = z.object({
	tagId: z.string().uuid(),
	tag: z.string(),
	allSelected: z.boolean().optional(),
	allUnselected: z.boolean().optional(),
	communities: recommendationCommunity.array(),
	noMoreCommunities: z.boolean().optional(),
})
export const communityRecommendations = z.map(
	z.string().uuid(),
	communityRecommendation,
)

export type CommunityRecommendations = z.infer<typeof communityRecommendations>
export type CommunityRecommendation = z.infer<typeof communityRecommendation>
export type RecommendationCommunity = z.infer<typeof recommendationCommunity>

export const getRecommendedCommunitiesInput = z.object({
	userId: z.string().uuid(),
	recommendationNum: getRecommendedCommunitiesProcedure,
})

export const getMoreRecommendedCommunitiesInput = z
	.object({
		userId: z.string().uuid(),
	})
	.merge(getMoreRecommendedCommunitiesProcedure)

export const getMoreRecommendedCommunitiesOutput = z.object({
	tagId: z.string().uuid(),
	communities: recommendationCommunity.array(),
})
export type GetMoreRecommendedCommunitiesOutput = z.infer<
	typeof getMoreRecommendedCommunitiesOutput
>

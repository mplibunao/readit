import { z } from 'zod'

export * as RecommendationSchemas from './recommendation.schema'

export const communityRecommendationsCommunity = z.object({
	id: z.string().uuid(),
	name: z.string(),
	description: z.string().nullable(),
	imageUrl: z.string().nullable(),
	numCommonTags: z.number().positive(),
	rank: z.number().positive(),
	selected: z.boolean().default(false).optional(),
})
export const communityRecommendationsTag = z.object({
	tagId: z.string().uuid(),
	tag: z.string(),
	allSelected: z.boolean().optional(),
	allUnselected: z.boolean().optional(),
	communities: communityRecommendationsCommunity.array(),
})
export const communityRecommendations = z.record(
	z.string().uuid(),
	communityRecommendationsTag,
)

export type CommunityRecommendations = z.infer<typeof communityRecommendations>
export type CommunityRecommendationsCommunity = z.infer<
	typeof communityRecommendationsCommunity
>
export type CommunityRecommendationsTag = z.infer<
	typeof communityRecommendationsTag
>

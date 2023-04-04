import { z } from 'zod'

export * as RecommendationSchemas from './recommendation.schema'

export const communityRecommendations = z.record(
	z.string().uuid(),
	z.object({
		tagId: z.string().uuid(),
		tag: z.string(),
		communities: z
			.object({
				id: z.string().uuid(),
				name: z.string(),
				description: z.string().nullable(),
				imageUrl: z.string().nullable(),
				numCommonTags: z.number().positive(),
				rank: z.number().positive(),
			})
			.array(),
	}),
)

export type CommunityRecommendations = z.infer<typeof communityRecommendations>

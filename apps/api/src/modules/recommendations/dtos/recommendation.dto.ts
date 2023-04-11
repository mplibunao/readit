import { z } from 'zod'

export * as RecommendationDto from './recommendation.dto'
export const getRecommendedCommunitiesProcedure = z.number().positive()

export const getMoreRecommendedCommunitiesProcedure = z.object({
	recommendationNum: getRecommendedCommunitiesProcedure,
	tagId: z.string().uuid(),
	offset: z.number().positive(),
	limit: z.number().positive(),
})

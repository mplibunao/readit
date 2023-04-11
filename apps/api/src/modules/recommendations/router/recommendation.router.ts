import { protectedProcedure, router } from '@api/trpc/builder'
import { UnauthorizedError } from '@api/utils/errors/baseError'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'

import { RecommendationSchemas } from '../domain/recommendation.schema'
import { RecommendationDto } from '../dtos/recommendation.dto'

export const recommendationRouter = router({
	getRecommendedCommunities: protectedProcedure
		.input(RecommendationDto.getRecommendedCommunitiesProcedure)
		.output(RecommendationSchemas.communityRecommendations)
		.query(async ({ ctx: { deps, session }, input }) => {
			const { logger, RecommendationService } = deps
			try {
				if (!session.user?.id) throw new UnauthorizedError({})
				return await RecommendationService.getRecommendedCommunities({
					userId: session.user.id,
					recommendationNum: input,
				})
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),

	getMoreRecommendedCommunities: protectedProcedure
		.input(RecommendationDto.getMoreRecommendedCommunitiesProcedure)
		.output(RecommendationSchemas.getMoreRecommendedCommunitiesOutput)
		.mutation(async ({ ctx: { deps, session }, input }) => {
			const { logger, RecommendationService } = deps
			try {
				if (!session.user?.id) throw new UnauthorizedError({})
				return await RecommendationService.getMoreRecommendedCommunities({
					userId: session.user.id,
					...input,
				})
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),
})

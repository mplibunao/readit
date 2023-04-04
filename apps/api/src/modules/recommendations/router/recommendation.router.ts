import { protectedProcedure, router } from '@api/trpc/builder'
import { UnauthorizedError } from '@api/utils/errors/baseError'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'

import { RecommendationSchemas } from '../domain/recommendation.schema'

export const recommendationRouter = router({
	getRecommendedCommunities: protectedProcedure
		.output(RecommendationSchemas.communityRecommendations)
		.query(async ({ ctx: { deps, session } }) => {
			const { logger, RecommendationService } = deps
			try {
				if (!session.user?.id) throw new UnauthorizedError({})
				return await RecommendationService.getRecommendedCommunities(
					session.user.id,
				)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),
})

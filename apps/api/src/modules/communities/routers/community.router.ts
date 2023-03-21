import { protectedProcedure, router } from '@api/trpc/builder'
import { UnauthorizedError } from '@api/utils/errors/baseError'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'

import { CommunitySchemas } from '../domain/community.schema'

export const communityRouter = router({
	createCommunity: protectedProcedure
		.input(CommunitySchemas.createCommunityInput)
		.mutation(async ({ ctx, input }) => {
			const { deps, session } = ctx
			const { logger, CommunityService } = deps
			try {
				if (!session.user?.id) throw new UnauthorizedError({})
				return await CommunityService.create(input, session.user.id)
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),
})

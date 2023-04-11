import { protectedProcedure, router } from '@api/trpc/builder'
import { UnauthorizedError } from '@api/utils/errors/baseError'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'
import { z } from 'zod'

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

	joinCommunities: protectedProcedure
		.input(z.string().uuid().array())
		.mutation(async ({ ctx, input }) => {
			const { deps, session } = ctx
			const { logger, CommunityService } = deps
			try {
				if (!session.user?.id) throw new UnauthorizedError({})
				return await CommunityService.joinCommunities({
					communityIds: input,
					userId: session.user.id,
				})
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),
})

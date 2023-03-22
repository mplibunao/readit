import { publicProcedure, router } from '@api/trpc/builder'
import { handleTRPCServiceErrors } from '@api/utils/errors/handleTRPCServiceErrors'

import { TagSchemas } from '../../recommendations/domain/tag.schema'

export const tagRouter = router({
	list: publicProcedure
		.output(TagSchemas.tag.array().optional())
		.query(async ({ ctx }) => {
			const { logger, TagService } = ctx.deps
			try {
				const tags = await TagService.listTags()
				return tags
			} catch (error) {
				throw handleTRPCServiceErrors(error, logger)
			}
		}),
})

import { id } from '@readit/utils'
import { z } from 'zod'

export * as TagSchemas from './tag.schema'

const name = z.string()
const isRecommended = z.boolean()

const baseCommunityTag = {
	tagId: z.string().uuid(),
	communityId: z.string().uuid(),
	isPrimary: z.boolean(),
}

export const communityTag = z.object(baseCommunityTag)

export const tag = z.object({
	id,
	name,
	isRecommended,
})
export type Tag = z.infer<typeof tag>

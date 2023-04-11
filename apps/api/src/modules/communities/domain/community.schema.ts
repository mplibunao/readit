import { id } from '@readit/utils'
import { z } from 'zod'

export * as CommunitySchemas from './community.schema'

export const name = z
	.string()
	.min(3, 'Please enter at least 3 characters')
	.max(21, 'Please enter at most 21 characters')
	.regex(/^[\w]+(_[\w]+)*$/, {
		message: 'Name can only contain letters, numbers, and underscores',
	})

export const description = z
	.string()
	.max(500, 'Please enter at most 500 characters')
	.optional()

export const isNsfw = z.boolean().optional()
export const community = z.object({
	id,
	name,
	description,
	isNsfw,
})
export const createCommunityInput = z.object({
	community: z.object({
		name,
		description,
		isNsfw,
	}),
	primaryTag: z.string().uuid().nullable(),
	secondaryTags: z.string().uuid().array().max(10),
})
export type CreateCommunityInput = z.infer<typeof createCommunityInput>

export const joinCommunitiesInput = z.object({
	communityIds: id.array().min(1),
	userId: id,
})

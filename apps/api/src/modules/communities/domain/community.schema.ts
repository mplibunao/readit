import { createdAt, id } from '@readit/utils'
import { z } from 'zod'

export * as CommunitySchemas from './community.schema'

export const name = z
	.string()
	.min(3, 'Please enter at least 3 characters')
	.max(21, 'Please enter at most 21 characters')
	.regex(/^[\w]+(_[\w]+)*$/, {
		message: 'Name can only contain letters, numbers, and underscores',
	})

const description = z.string().max(500, 'Please enter at most 500 characters')
export const descriptionInput = description.optional()
export const descriptionOutput = description.nullable()

export const isNsfwInput = z.boolean().optional()
export const isNsfwOutput = z.boolean().nullable()
export const imageUrl = z.string().url().nullable()
export const bannerImageUrl = z.string().url().nullable()
export const community = z.object({
	id,
	name,
	description: descriptionOutput,
	isNsfw: isNsfwOutput,
	imageUrl,
	bannerImageUrl,
	createdAt,
	membersNum: z.number().nonnegative(),
})
export const createCommunityInput = z.object({
	community: z.object({
		name,
		description: descriptionInput,
		isNsfw: isNsfwInput,
	}),
	primaryTag: z.string().uuid().nullable(),
	secondaryTags: z.string().uuid().array().max(10),
})
export type CreateCommunityInput = z.infer<typeof createCommunityInput>

export const joinCommunitiesInput = z.object({
	communityIds: id.array().min(1),
	userId: id,
})
export const getUserCommunitiesOutput = z.object({
	id,
	name,
	imageUrl,
})
export type GetUserCommunitiesOutput = z.infer<typeof getUserCommunitiesOutput>

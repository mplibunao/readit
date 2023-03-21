import { Dependencies } from '@api/infra/diConfig'
import { AppError, InternalServerError } from '@api/utils/errors/baseError'
import { z } from 'zod'

import {
	MustHavePrimaryTagToCreateSecondaryTags,
	PrimaryTagCannotBeSecondaryTag,
} from '../domain/community.errors'
import { CommunitySchemas } from '../domain/community.schema'

export type CommunityService = ReturnType<typeof buildCommunityService>

export const buildCommunityService = ({
	CommunityRepository,
	logger,
	pg,
	TagService,
}: Dependencies) => {
	const create = z
		.function()
		.args(CommunitySchemas.createCommunityInput, z.string())
		.implement(async (params, userId) => {
			try {
				return await pg.transaction().execute(async (trx) => {
					const community = await CommunityRepository.create(
						params.community,
						trx,
					)
					const { id: communityId } = community

					const membership = await CommunityRepository.createMembership(
						{
							communityId,
							userId,
							role: 'moderator',
						},
						trx,
					)

					if (!params.primaryTag && params.secondaryTags.length === 0) {
						return { community, membership, communityTags: [] }
					}
					if (params.secondaryTags.length > 0 && !params.primaryTag) {
						throw new MustHavePrimaryTagToCreateSecondaryTags({})
					}
					if (params.primaryTag && params.secondaryTags.length > 0) {
						const isDuplicate = params.secondaryTags.includes(params.primaryTag)
						if (isDuplicate) {
							throw new PrimaryTagCannotBeSecondaryTag({})
						}
					}

					const tags = params.secondaryTags.map((tagId) => ({
						tagId,
						communityId,
						isPrimary: false,
					}))

					if (params.primaryTag) {
						tags.push({
							tagId: params.primaryTag,
							communityId,
							isPrimary: true,
						})
					}

					const communityTags = await TagService.createCommunityTags(tags, trx)

					return { community, membership, communityTags }
				})
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ error, params, userId },
						`Failed to create community: ${error.type}`,
					)
					throw error
				}
				logger.error({ error, params, userId }, 'Failed to create community')
				throw new InternalServerError({ cause: error })
			}
		})

	return {
		create,
	}
}

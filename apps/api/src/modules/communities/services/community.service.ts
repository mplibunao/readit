import { Dependencies } from '@api/infra/diConfig'
import { MembershipRole } from '@api/infra/pg/types'
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

					const membershipPromise = CommunityRepository.createMembership(
						{
							communityId,
							userId,
							role: 'moderator',
						},
						trx,
					)

					if (!params.primaryTag && params.secondaryTags.length === 0) {
						const [membership] = await Promise.all([membershipPromise])
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

					const tagsPromise = TagService.createCommunityTags(tags, trx)

					const [membership, communityTags] = await Promise.all([
						membershipPromise,
						tagsPromise,
					])

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

	const joinCommunities = z
		.function()
		.args(CommunitySchemas.joinCommunitiesInput)
		.implement(async ({ communityIds, userId }) => {
			try {
				const role: MembershipRole = 'member'
				const params = communityIds.map((communityId) => ({
					userId,
					communityId,
					role,
				}))
				return await CommunityRepository.createMemberships(params)
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ error, communityIds, userId },
						`Failed to join communities: ${error.type}`,
					)
					throw error
				}
				logger.error(
					{ error, communityIds, userId },
					'Failed to join communities',
				)
				throw new InternalServerError({ cause: error })
			}
		})

	const getUserCommunities = z
		.function()
		.args(z.string().uuid())
		.returns(z.promise(CommunitySchemas.getUserCommunitiesOutput.array()))
		.implement(async (userId) => {
			try {
				return await CommunityRepository.getUserCommunities(userId)
			} catch (error) {
				if (error instanceof AppError) {
					logger.error(
						{ error, userId },
						`Failed to get user communities: ${error.type}`,
					)
					throw error
				}
				logger.error({ error, userId }, 'Failed to get user communities')
				throw new InternalServerError({ cause: error })
			}
		})

	return {
		create,
		joinCommunities,
		getUserCommunities,
	}
}

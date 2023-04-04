import { Dependencies } from '@api/infra/diConfig'
import { z } from 'zod'

import { RecommendationSchemas } from '../domain/recommendation.schema'

export type RecommendationService = ReturnType<
	typeof buildRecommendationService
>

export const buildRecommendationService = ({ TagRepository }: Dependencies) => {
	return {
		getRecommendedCommunities: z
			.function()
			.args(z.string().uuid())
			.returns(z.promise(RecommendationSchemas.communityRecommendations))
			.implement(async (userId) => {
				const flatRecommendations =
					await TagRepository.getRecommendedCommunities(userId)

				return flatRecommendations.reduce(
					(
						acc: RecommendationSchemas.CommunityRecommendations,
						recommendation,
					) => {
						const { tagId } = recommendation
						const numCommonTags = Number(recommendation.numCommonTags)
						const rank = Number(recommendation.rank)

						const community = {
							id: recommendation.communityId,
							name: recommendation.community,
							numCommonTags,
							rank,
							description: recommendation.communityDescription,
							imageUrl: recommendation.communityImageUrl,
						}

						if (acc[tagId]) {
							acc[tagId]!.communities.push(community)
						} else {
							acc[tagId] = {
								tagId,
								tag: recommendation.tag,
								communities: [community],
							}
						}

						return acc
					},
					{},
				)
			}),
	}
}

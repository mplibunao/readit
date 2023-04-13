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
			.args(RecommendationSchemas.getRecommendedCommunitiesInput)
			.returns(z.promise(RecommendationSchemas.communityRecommendations))
			.implement(async ({ userId, recommendationNum }) => {
				const flatRecommendations =
					await TagRepository.getRecommendedCommunities({
						userId: userId,
						recommendationNum,
					})

				return flatRecommendations.reduce<RecommendationSchemas.CommunityRecommendations>(
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

						const existingRecommendation = acc.get(tagId)

						if (existingRecommendation) {
							existingRecommendation.communities.push(community)
							acc.set(tagId, existingRecommendation)
						} else {
							acc.set(tagId, {
								tagId,
								tag: recommendation.tag,
								communities: [community],
							})
						}

						return acc
					},
					new Map<string, RecommendationSchemas.CommunityRecommendation>(),
				)
			}),

		getMoreRecommendedCommunities: z
			.function()
			.args(RecommendationSchemas.getMoreRecommendedCommunitiesInput)
			.returns(
				z.promise(RecommendationSchemas.getMoreRecommendedCommunitiesOutput),
			)
			.implement(
				async ({ userId, recommendationNum, tagId, offset, limit }) => {
					const flatRecommendations =
						await TagRepository.getMoreRecommendedCommunities({
							userId: userId,
							recommendationNum,
							tagId,
							offset,
							limit,
						})

					const communities = flatRecommendations.map((recommendation) => ({
						id: recommendation.communityId,
						name: recommendation.community,
						numCommonTags: Number(recommendation.numCommonTags),
						rank: Number(recommendation.rank),
						description: recommendation.communityDescription,
						imageUrl: recommendation.communityImageUrl,
					}))

					return {
						communities,
						tagId,
					}
				},
			),
	}
}

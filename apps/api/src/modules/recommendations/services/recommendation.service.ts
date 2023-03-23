import { Dependencies } from '@api/infra/diConfig'

//import { z } from 'zod'

export const buildRecommendationService = (_: Dependencies) => {
	//const getRecommendedCommunities = z.function().args(z.string().uuid())
	/*
	 *SELECT communities.*, tags.name FROM communities
	 *join community_tags on community_tags.community_id = communities.id
	 *join tags on tags.id = community_tags.tag_id
	 *join user_interests on user_interests.tag_id = tags.id
	 *where user_interests.user_id = 'user_id'
	 *group by tags.name, communities.id
	 *order by count(*) desc
	 *limit 25
	 */
}

/*
 *SELECT communities.*
 *FROM communities
 *JOIN community_tags ON community_tags.community_id = communities.id
 *JOIN tags ON tags.id = community_tags.tag_id
 *JOIN user_interests ON user_interests.tag_id = tags.id
 *WHERE user_interests.user_id = 'user_id' AND tags.id = 'tag_id'
 *GROUP BY communities.id
 *ORDER BY count(*) DESC, community_tags.isPrimary DESC
 *LIMIT 25 OFFSET 25
 */

/*
 *SELECT community_tags.tag_id, tags.name, communities.*, ROW_NUMBER() OVER(PARTITION BY community_tags.tag_id) AS rank
 *FROM communities
 *JOIN community_tags ON community_tags.community_id = communities.id
 *JOIN tags ON tags.id = community_tags.tag_id
 *;
 */



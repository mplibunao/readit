
-- outermost allows us to limit to certain number
SELECT tag, community_name, tag_rank, num_common_tags, is_primary
FROM (
	SELECT t.name AS tag, c.name AS community_name, is_primary,
				-- partitions tagid and ranks within each partition (by num_common_tags then is_primary)
			 ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY num_common_tags DESC, ct.is_primary DESC) AS tag_rank,
			 num_common_tags
		FROM community_tags ct
		JOIN communities c ON ct.community_id = c.id
		JOIN tags t ON ct.tag_id = t.id
		JOIN user_interests ui ON t.id = ui.tag_id
		JOIN users u ON ui.user_id = u.id
		JOIN (
			-- subquery that gets the number of common tags for community and user
			SELECT ct.community_id, COUNT(*) AS num_common_tags
			FROM community_tags ct
			JOIN user_interests ui ON ct.tag_id = ui.tag_id
			WHERE ui.user_id = '80d4d2a8-a6dd-48e6-bebe-fa24e7f64d1f'
			GROUP BY ct.community_id
		) common_tags ON c.id = common_tags.community_id
		WHERE u.id = '80d4d2a8-a6dd-48e6-bebe-fa24e7f64d1f'
		GROUP BY t.id, c.id, common_tags.num_common_tags, ct.is_primary
) community_recommendations
WHERE tag_rank <= 5
ORDER BY tag, tag_rank;


-- show more
				-- partitions tagid and ranks within each partition (by num_common_tags then is_primary)
			-- subquery that gets the number of common tags for community and user
SELECT tag, community_name, tag_rank, num_common_tags, is_primary
FROM (
	SELECT t.name AS tag, c.name AS community_name, is_primary,
			 ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY num_common_tags DESC, ct.is_primary DESC) AS tag_rank,
			 num_common_tags
		FROM community_tags ct
		JOIN communities c ON ct.community_id = c.id
		JOIN tags t ON ct.tag_id = t.id
		JOIN user_interests ui ON t.id = ui.tag_id
		JOIN users u ON ui.user_id = u.id
		JOIN (
			SELECT ct.community_id, COUNT(*) AS num_common_tags
			FROM community_tags ct
			JOIN user_interests ui ON ct.tag_id = ui.tag_id
			WHERE ui.user_id = '80d4d2a8-a6dd-48e6-bebe-fa24e7f64d1f'
			GROUP BY ct.community_id
		) common_tags ON c.id = common_tags.community_id
		WHERE u.id = '80d4d2a8-a6dd-48e6-bebe-fa24e7f64d1f'
		AND t.name = 'Programming'
		GROUP BY t.id, c.id, common_tags.num_common_tags, ct.is_primary
) community_recommendations
WHERE tag_rank <= 10
OFFSET 5 LIMIT 5;

import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createIndex('idx_community_tags_is_primary')
		.on('communityTags')
		.column('isPrimary')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.dropIndex('idx_community_tags_is_primary')
		.ifExists()
		.execute()
}

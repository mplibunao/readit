import { Kysely } from 'kysely'

import { createTable } from '../utils'

export async function up(db: Kysely<any>): Promise<void> {
	await createTable(db.schema, 'communityTags', {
		deletedAt: false,
	})
		.addColumn('tagId', 'uuid', (col) => col.notNull().references('tags.id'))
		.addColumn('communityId', 'uuid', (col) =>
			col.notNull().references('communities.id'),
		)
		.addColumn('isPrimary', 'boolean', (col) => col.notNull().defaultTo(false))
		.execute()

	await db.schema
		.createIndex('idx_community_tags_tag_id')
		.on('communityTags')
		.column('tagId')
		.execute()
	await db.schema
		.createIndex('idx_community_tags_community_id')
		.on('communityTags')
		.column('communityId')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('idx_community_tags_tag_id').ifExists().execute()
	await db.schema
		.dropIndex('idx_community_tags_community_id')
		.ifExists()
		.execute()

	await db.schema.dropTable('communityTags').ifExists().execute()
}

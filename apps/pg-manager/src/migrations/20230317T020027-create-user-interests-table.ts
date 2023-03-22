import { Kysely } from 'kysely'

import { createTable } from '../utils'

export async function up(db: Kysely<any>): Promise<void> {
	await createTable(db.schema, 'userInterests', { deletedAt: false })
		.addColumn('userId', 'uuid', (col) => col.notNull().references('users.id'))
		.addColumn('tagId', 'uuid', (col) => col.notNull().references('tags.id'))
		.execute()

	await db.schema
		.createIndex('idx_user_interests_user_id')
		.on('userInterests')
		.column('userId')
		.execute()
	await db.schema
		.createIndex('idx_user_interests_tag_id')
		.on('userInterests')
		.column('tagId')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('idx_user_interests_user_id').ifExists().execute()
	await db.schema.dropIndex('idx_user_interests_tag_id').ifExists().execute()

	await db.schema.dropTable('userInterests').ifExists().execute()
}

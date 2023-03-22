import { Kysely } from 'kysely'

import {
	createTable,
	createUpdatedAtTrigger,
	dropUpdatedAtTrigger,
} from '../utils'

export async function up(db: Kysely<any>): Promise<void> {
	await createTable(db.schema, 'tags', {})
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('isRecommended', 'boolean', (col) =>
			col.notNull().defaultTo(false),
		)
		.execute()

	await createUpdatedAtTrigger(db, 'tags')
	await db.schema
		.createIndex('idx_tags_is_recommended')
		.on('tags')
		.column('isRecommended')
		.execute()

	await db.schema
		.createIndex('idx_deleted_at')
		.on('tags')
		.column('deletedAt')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('idx_tags_is_recommended').ifExists().execute()
	await db.schema.dropIndex('idx_deleted_at').ifExists().execute()
	await dropUpdatedAtTrigger(db, 'tags')
	await db.schema.dropTable('tags').ifExists().execute()
}

import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createIndex('idx_communities_name')
		.on('communities')
		.column('name')
		.ifNotExists()
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('idx_communities_name').ifExists().execute()
}

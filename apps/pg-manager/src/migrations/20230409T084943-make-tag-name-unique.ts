import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('tags')
		.addUniqueConstraint('tags_name', ['name'])
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('tags')
		.dropConstraint('tags_name')
		.ifExists()
		.execute()
}

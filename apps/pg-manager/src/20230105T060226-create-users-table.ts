import { Kysely, sql } from 'kysely'

import { DB } from './db'

export async function up(db: Kysely<DB>): Promise<void> {
	const a = db.schema
	await db.schema
		.createTable('users')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`GEN_RANDOM_UUID()`),
		)
		.addColumn('createdAt', 'timestamptz', (col) =>
			col.defaultTo(sql`NOW()`).notNull(),
		)
		.addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`NOW()`))
		.addColumn('deactivatedAt', 'timestamptz')
		.execute()
}

export async function down(db: Kysely<DB>): Promise<void> {
	await db.schema.dropTable('users').ifExists().execute()
}

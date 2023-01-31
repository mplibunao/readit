import { IDB } from '../db'

export async function up(db: IDB): Promise<void> {
	await db.schema
		.alterTable('users')
		.addColumn('username', 'text', (col) => col.unique().notNull())
		.execute()

	await db.schema
		.createIndex('idx_users_username')
		.on('users')
		.column('username')
		.execute()
}

export async function down(db: IDB): Promise<void> {
	await db.schema.dropIndex('idx_users_username').ifExists().execute()
	await db.schema.alterTable('users').dropColumn('username').execute()
}

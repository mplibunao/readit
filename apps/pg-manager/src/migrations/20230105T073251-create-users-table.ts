import { sql } from 'kysely'

import { IDB } from '../db'
import { createTable } from '../utils'

export async function up(db: IDB): Promise<void> {
	await createTable(db.schema, 'users', {})
		.addColumn('email', 'text', (col) => col.unique().notNull())
		.addColumn('username', 'text', (col) => col.unique().notNull())
		.addColumn('hashedPassword', 'text')
		.addColumn('firstName', 'text', (col) => col.notNull())
		.addColumn('lastName', 'text', (col) => col.notNull())
		.addColumn('confirmedAt', 'timestamptz')
		.addColumn('isAdmin', 'boolean', (col) => col.notNull().defaultTo('false'))
		.addColumn('onboardedAt', 'timestamptz')
		.execute()

	await sql`
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE on_updated_at_timestamp();
  `.execute(db)

	await db.schema
		.createIndex('idx_users_email')
		.on('users')
		.column('email')
		.execute()

	await db.schema
		.createIndex('idx_users_username')
		.on('users')
		.column('username')
		.execute()
}

export async function down(db: IDB): Promise<void> {
	await db.schema.dropIndex('idx_users_username').ifExists().execute()
	await db.schema.dropIndex('idx_users_email').ifExists().execute()

	await sql`
		DROP TRIGGER IF EXISTS update_users_updated_at ON users;
	`.execute(db)
	await db.schema.dropTable('users').ifExists().execute()
}

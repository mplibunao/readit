import { IDB } from '../db'
import {
	createUpdatedAtTrigger,
	createTable,
	dropUpdatedAtTrigger,
} from '../utils'

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

	await createUpdatedAtTrigger(db, 'users')

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
	await dropUpdatedAtTrigger(db, 'users')
	await db.schema.dropTable('users').ifExists().execute()
}

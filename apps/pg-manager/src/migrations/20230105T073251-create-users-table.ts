import { IDB } from 'src/db'
import {
	createUpdatedAtTrigger,
	createTable,
	dropUpdatedAtTrigger,
} from 'src/utils'

export async function up(db: IDB): Promise<void> {
	await createTable(db.schema, 'users', {})
		.addColumn('email', 'text', (col) => col.unique().notNull())
		.addColumn('hashedPassword', 'text', (col) => col.notNull())
		.addColumn('firstName', 'text', (col) => col.notNull())
		.addColumn('lastName', 'text', (col) => col.notNull())
		.execute()

	await createUpdatedAtTrigger(db, 'users')

	await db.schema
		.createIndex('idx_users_email')
		.on('users')
		.column('email')
		.execute()
}

export async function down(db: IDB): Promise<void> {
	await db.schema.dropIndex('idx_users_email').ifExists().execute()
	await dropUpdatedAtTrigger(db, 'users')
	await db.schema.dropTable('users').ifExists().execute()
}

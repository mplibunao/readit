import { Kysely } from 'kysely'

import {
	createTable,
	createUpdatedAtTrigger,
	dropUpdatedAtTrigger,
} from '../utils'

export async function up(db: Kysely<any>): Promise<void> {
	await createTable(db.schema, 'communities', {})
		.addColumn('name', 'text', (col) => col.notNull().unique())
		.addColumn('description', 'text')
		.addColumn('isNsfw', 'boolean', (col) => col.notNull().defaultTo('false'))
		.execute()

	await createUpdatedAtTrigger(db, 'communities')
}

export async function down(db: Kysely<any>): Promise<void> {
	await dropUpdatedAtTrigger(db, 'communities')
	await db.schema.dropTable('communities').ifExists().execute()
}

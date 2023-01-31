import { sql } from 'kysely'

import { IDB } from '../db'
import {
	createTable,
	createUpdatedAtTrigger,
	dropUpdatedAtTrigger,
} from '../utils'

export async function up(db: IDB): Promise<void> {
	await createTable(db.schema, 'tokens', { deletedAt: false })
		.addColumn('type', 'varchar(255)', (col) =>
			col.notNull().check(sql`type IN ('accountActivation')`),
		)
		.addColumn('usedAt', 'timestamptz')
		.addColumn('userId', 'uuid', (col) => col.notNull().references('users.id'))
		.execute()

	await createUpdatedAtTrigger(db, 'tokens')
}

export async function down(db: IDB): Promise<void> {
	await dropUpdatedAtTrigger(db, 'tokens')
	await db.schema.dropTable('tokens').ifExists().execute()
}

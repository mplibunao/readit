import { sql } from 'kysely'

import { IDB } from '../db'

const constraint_name = 'tokens_type_check'

export async function up(db: IDB): Promise<void> {
	await db.schema
		.alterTable('tokens')
		.dropConstraint(constraint_name)
		.ifExists()
		.execute()
	await db.schema
		.alterTable('tokens')
		.addCheckConstraint(
			constraint_name,
			sql`type IN ('accountActivation', 'passwordReset', 'login')`,
		)
		.execute()
	await db.schema
		.alterTable('tokens')
		.addColumn('expiresAt', 'timestamptz')
		.execute()
}

export async function down(db: IDB): Promise<void> {
	await db.schema.alterTable('tokens').dropColumn('expiresAt').execute()
	await db
		.deleteFrom('tokens')
		.where('type', '!=', 'accountActivation')
		.execute()
	await db.schema
		.alterTable('tokens')
		.dropConstraint(constraint_name)
		.ifExists()
		.execute()
	await db.schema
		.alterTable('tokens')
		.addCheckConstraint(constraint_name, sql`type IN ('accountActivation')`)
		.execute()
}

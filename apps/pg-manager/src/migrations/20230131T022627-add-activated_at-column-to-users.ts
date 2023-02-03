import { IDB } from '../db'

export async function up(db: IDB): Promise<void> {
	await db.schema
		.alterTable('users')
		.addColumn('confirmedAt', 'timestamptz')
		.execute()
}

export async function down(db: IDB): Promise<void> {
	await db.schema.alterTable('users').dropColumn('activatedAt').execute()
}

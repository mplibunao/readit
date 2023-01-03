import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createType('gender')
		.asEnum(['male', 'female', 'prefer_not_to_say'])
		.execute()

	await db.schema
		.alterTable('users')
		.addColumn('gender', sql`gender`)
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable('users').dropColumn('gender').execute()

	await db.schema.dropType('gender').execute()
}

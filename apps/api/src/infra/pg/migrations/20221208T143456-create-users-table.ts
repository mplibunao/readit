import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable('users')
		.ifNotExists()
		.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`gen_random_uuid()`)
		)
		.addColumn('email', 'text', (col) => col.unique().notNull())
		.addColumn('hashedPassword', 'text', (col) => col.notNull())
		.addColumn('firstName', 'text', (col) => col.notNull())
		.addColumn('lastName', 'text', (col) => col.notNull())
		.addColumn('createdAt', 'timestamptz', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn('updatedAt', 'timestamptz', (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn('deactivatedAt', 'timestamptz')
		.execute()

	await db.schema
		.createIndex('idx_users_email')
		.on('users')
		.column('email')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable('users').execute()
}

import { Kysely, sql } from 'kysely'

import { createTable } from '../utils'

export async function up(db: Kysely<any>): Promise<void> {
	await createTable(db.schema, 'communities', {})
		.addColumn('name', 'text', (col) => col.notNull().unique())
		.addColumn('description', 'text')
		.addColumn('isNsfw', 'boolean', (col) => col.notNull().defaultTo('false'))
		.execute()

	await sql`
    CREATE TRIGGER update_communities_updated_at
    BEFORE UPDATE ON communities
    FOR EACH ROW
    EXECUTE PROCEDURE on_updated_at_timestamp();
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
	await sql`
		DROP TRIGGER IF EXISTS update_communities_updated_at ON communities;
	`.execute(db)
	await db.schema.dropTable('communities').ifExists().execute()
}

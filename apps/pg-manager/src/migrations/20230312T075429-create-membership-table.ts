import { Kysely, sql } from 'kysely'

import { createTable } from '../utils'

export async function up(db: Kysely<any>): Promise<void> {
	await createTable(db.schema, 'memberships', {})
		.addColumn('userId', 'uuid', (col) => col.notNull().references('users.id'))
		.addColumn('communityId', 'uuid', (col) =>
			col.notNull().references('communities.id'),
		)
		.addColumn('role', 'text', (col) => col.notNull())
		.addCheckConstraint(
			'memberships_role_check',
			sql`role IN ('member', 'moderator')`,
		)
		.execute()

	await sql`
    CREATE TRIGGER update_memberships_updated_at
    BEFORE UPDATE ON memberships
    FOR EACH ROW
    EXECUTE PROCEDURE on_updated_at_timestamp();
  `.execute(db)

	await db.schema
		.createIndex('idx_memberships_user_id')
		.on('memberships')
		.column('userId')
		.execute()

	await db.schema
		.createIndex('idx_memberships_community_id')
		.on('memberships')
		.column('communityId')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('idx_memberships_user_id').ifExists().execute()
	await db.schema.dropIndex('idx_memberships_community_id').ifExists().execute()
	await sql`
		DROP TRIGGER IF EXISTS update_memberships_updated_at ON memberships;
	`.execute(db)
	await db.schema.dropTable('memberships').ifExists().execute()
}

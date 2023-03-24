import { Kysely, sql } from 'kysely'

import {
	createTable,
	createUpdatedAtTrigger,
	dropUpdatedAtTrigger,
} from '../utils'

export async function up(db: Kysely<any>): Promise<void> {
	await createTable(db.schema, 'social_accounts', { deletedAt: false })
		.addColumn('socialId', 'text', (col) => col.notNull())
		.addColumn('provider', 'text', (col) => col.notNull())
		.addColumn('usernameOrEmail', 'text', (col) => col.notNull())
		.addCheckConstraint(
			'social_accounts_provider_check',
			sql`provider IN ('google', 'discord')`,
		)
		.addColumn('userId', 'uuid', (col) =>
			col.notNull().references('users.id').onDelete('cascade'),
		)
		.addUniqueConstraint('provider_user_id_social_id_unique', [
			'provider',
			'userId',
			'socialId',
		])
		.execute()

	await createUpdatedAtTrigger(db, 'social_accounts')

	await db.schema
		.createIndex('idx_social_accounts_social_id')
		.on('social_accounts')
		.column('socialId')
		.execute()
	await db.schema
		.createIndex('idx_social_accounts_user_id')
		.on('social_accounts')
		.column('userId')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropIndex('idx_social_accounts_user_id').ifExists().execute()
	await db.schema
		.dropIndex('idx_social_accounts_social_id')
		.ifExists()
		.execute()
	await dropUpdatedAtTrigger(db, 'social_accounts')
	await db.schema.dropTable('social_accounts').ifExists().execute()
}

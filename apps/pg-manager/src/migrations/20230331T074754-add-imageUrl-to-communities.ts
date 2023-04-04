import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('communities')
		.addColumn('imageUrl', 'text')
		.addColumn('bannerImageUrl', 'text')
		.execute()
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable('communities')
		.dropColumn('imageUrl')
		.dropColumn('bannerImageUrl')
		.execute()
}

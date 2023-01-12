import { CreateTableBuilder, SchemaModule, sql } from 'kysely'

import { IDB } from './db'

interface CreateTableOptions {
	id?: boolean
	createdAt?: boolean
	updatedAt?: boolean
	deletedAt?: boolean
}

type TableBuilder = CreateTableBuilder<string, never>

export const createTable = (
	schema: SchemaModule,
	tableName: string,
	{
		id = true,
		createdAt = true,
		updatedAt = true,
		deletedAt = true,
	}: CreateTableOptions,
): TableBuilder => {
	let table = schema.createTable(tableName).ifNotExists()

	if (id) {
		table = table.addColumn('id', 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`GEN_RANDOM_UUID()`),
		)
	}

	if (createdAt) {
		table = table.addColumn('createdAt', 'timestamptz', (col) =>
			col.notNull().defaultTo(sql`NOW()`),
		)
	}

	if (updatedAt) {
		table = table.addColumn('updatedAt', 'timestamptz', (col) =>
			col.notNull().defaultTo(sql`NOW()`),
		)
	}

	if (deletedAt) {
		table = table.addColumn('deletedAt', 'timestamptz')
	}

	return table
}

export const createUpdatedAtTrigger = async (
	db: IDB,
	name: string,
): Promise<void> => {
	const { ref } = db.dynamic

	await sql`
    CREATE TRIGGER ${ref(`update_${name}_updated_at`)}
    BEFORE UPDATE ON ${ref(name)}
    FOR EACH ROW
    EXECUTE PROCEDURE on_updated_at_timestamp();
  `.execute(db)
}

export const dropUpdatedAtTrigger = async (
	db: IDB,
	name: string,
): Promise<void> => {
	const { ref } = db.dynamic

	await sql`
		DROP TRIGGER IF EXISTS ${ref(`update_${name}_updated_at`)} ON ${ref(name)};
	`.execute(db)
}

import { sql } from 'kysely'
import { IDB } from 'src/db'

export async function up(db: IDB): Promise<void> {
	await sql`
    CREATE OR REPLACE FUNCTION on_updated_at_timestamp()
    RETURNS trigger AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `.execute(db)
}

export async function down(db: IDB): Promise<void> {
	await sql`
    DROP FUNCTION IF EXISTS on_updated_at_timestamp;
  `.execute(db)
}

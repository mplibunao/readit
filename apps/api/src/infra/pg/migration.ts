import { promises as fs } from 'fs'
import { FileMigrationProvider, Migrator } from 'kysely'
import * as path from 'path'

import { db } from './client'

/*
 *Loading the ts migration files inside the `migrationFolder` causes an error because globals and setupFiles are ts and ts stuff haven't loaded yet
 *Possible solutions:
 *- Bundle this file and the migration files to js and use those for globalSetup
 *- Run the migration for other envs using the cli where we can use ts-node
 *- Migrate to a different db migration tool. Ley the previous one I've used supports using esbuild-register
 */

export async function migrateToLatest() {
	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, 'dist/migrations'),
		}),
	})

	const { error, results } = await migrator.migrateToLatest()

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`migration "${it.migrationName}" was executed successfully`)
		} else if (it.status === 'Error') {
			console.error(`failed to execute migration "${it.migrationName}"`)
		}
	})

	if (error) {
		console.error('failed to migrate')
		console.error(error)
		process.exit(1)
	}

	await db.destroy()
}

export default async function () {
	await migrateToLatest()
	return () => {}
}

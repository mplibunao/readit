import { promises as fs } from 'fs'
import { FileMigrationProvider, Migrator } from 'kysely'
import { run } from 'kysely-migration-cli'
import * as path from 'path'

import { db } from './client'

/*
 *https://github.com/acro5piano/kysely-migration-cli
 *CLI-based migration
 */

const migrationPath = path.join(__dirname, 'migrations')
const migrator = new Migrator({
	db,
	provider: new FileMigrationProvider({
		fs,
		path,
		migrationFolder: migrationPath,
	}),
})
run(db, migrator, migrationPath)

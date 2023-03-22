import { getKyselyPgConfig } from '@readit/kysely-pg-config'
import { DB } from '@readit/pg-manager'
import { Disposer } from 'awilix'
import { Kysely } from 'kysely'

import { Dependencies } from '../diConfig'

export type PG = Kysely<DB>

export const createPgClient = (deps: Dependencies) => {
	try {
		const kyselyPgConfig = getKyselyPgConfig({
			...deps.config.pg,
			logger: deps.logger,
		})

		return new Kysely<DB>(kyselyPgConfig)
	} catch (err) {
		const error = `Error initializing kysely with postgres dialect: ${err}`
		deps.logger.error(error)
		throw new Error(error)
	}
}

export const closePgClient: Disposer<PG> = (pg) => {
	return pg.destroy()
}

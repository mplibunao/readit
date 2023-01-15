import { config } from '@api/config'
import { getKyselyPgConfig, KyselyPGConfigOpts } from '@readit/kysely-pg-config'
import { DB } from '@readit/pg-manager'
import { Kysely } from 'kysely'

import { logger } from '../logger'

export type PgClientOpts = Omit<KyselyPGConfigOpts, 'logger'>
export type PG = Kysely<DB>

const kyselyPgConfig = getKyselyPgConfig({
	...config.pg,
	logger,
})

export const pg = new Kysely<DB>(kyselyPgConfig)

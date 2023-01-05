import { config } from '@api/config'

import { createPgClient, PG } from './createClient'
//import { createPgClient, PG } from '@readit/pg'
import { pgLogCallback } from './pgLogCallback'

export const pg: PG = createPgClient(config.pg, pgLogCallback)

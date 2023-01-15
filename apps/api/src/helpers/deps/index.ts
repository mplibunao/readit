import { logger } from '@api/infra/logger'
import { PG, pg } from '@api/infra/pg/client'
import { Logger } from '@readit/logger'

export const deps: Deps = { logger, pg }

export type Deps = { logger: Logger; pg: PG }

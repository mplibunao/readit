import { config } from '../../config'
import { logger } from '../logger'
import { createPgClient } from './createClient'

export const db = createPgClient(config.pg, logger)

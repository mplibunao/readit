import { loggerConfig } from '../env'
import { getLogger, Logger } from './createLogger'

export const logger: Logger = getLogger(loggerConfig)

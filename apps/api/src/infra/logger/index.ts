import { config } from '@api/config'
import { getLogger, Logger } from '@readit/pino-logger'

export const logger: Logger = getLogger(config.loggerOpts)

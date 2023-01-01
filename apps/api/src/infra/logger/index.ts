import { config } from '@api/config'
import { getLogger } from '@readit/pino-logger'

export const logger = getLogger(config.loggerOpts)

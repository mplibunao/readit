import { config } from '@api/infra/config'
import { getLogger, Logger } from '@readit/logger'

export const logger: Logger = getLogger(config.loggerOpts)

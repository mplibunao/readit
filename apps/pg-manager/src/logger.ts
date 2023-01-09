import { getLogger, Logger } from '@readit/logger'

import { loggerConfig } from './env'

export const logger: Logger = getLogger(loggerConfig)

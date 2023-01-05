import { getLogger } from '@readit/pino-logger'

import { loggerConfig } from './env'

export const logger = getLogger(loggerConfig)

import { config } from '@api/config'
import pino from 'pino'

import { getLoggerConfig } from './loggerConfig'

const loggerConfig = getLoggerConfig(config.loggerOpts)
export const logger = pino(loggerConfig)

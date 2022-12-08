import { getLoggerConfig } from './logger'
import pino from 'pino'
import { config } from '@/config'

const loggerConfig = getLoggerConfig(config.loggerOpts)
export const logger = pino(loggerConfig)
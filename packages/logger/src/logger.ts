import { loadEnv } from '@readit/env'
import { parseEnv } from 'znv'

import { getLogger, loggerOptsEnvSchema } from '.'

loadEnv()

const loggerConfig = parseEnv(process.env, loggerOptsEnvSchema)

export const logger = getLogger(loggerConfig)

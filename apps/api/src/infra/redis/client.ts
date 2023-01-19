import { config } from '@api/config'

import { createRedisClient } from './createClient'

export const redis = createRedisClient(config.redis)

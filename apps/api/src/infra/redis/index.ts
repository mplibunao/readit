import { Disposer } from 'awilix'
import Redis from 'ioredis'
import { z } from 'zod'

import { Config, Env } from '../config'
import { Dependencies } from '../diConfig'

export const redisEnvSchema = {
	REDIS_URL: z.string(),
	REDIS_ENABLE_AUTO_PIPELINING: z
		.boolean()
		.optional()
		.default(true)
		.describe('https://www.youtube.com/watch?app=desktop&v=0L0ER4pZbX4'),
	REDIS_MAX_RETRIES_PER_REQ: z
		.number()
		.optional()
		.default(20)
		.describe(
			"Lower is better for perf, since we don't wait when there are errors. If failing fast is ok",
		),
	REDIS_CONNECT_TIMEOUT: z.number().optional().default(10_000),
}

const redisSchema = z.object(redisEnvSchema)

export type RedisOpts = z.infer<typeof redisSchema>

export const createRedisClient = ({ config, logger }: Dependencies) => {
	try {
		return new Redis(config.redis.REDIS_URL, {
			maxRetriesPerRequest: config.redis.REDIS_MAX_RETRIES_PER_REQ,
			connectTimeout: config.redis.REDIS_CONNECT_TIMEOUT,
			enableAutoPipelining: config.redis.REDIS_ENABLE_AUTO_PIPELINING,
			family: 4,
		})
	} catch (error) {
		const err = `Creating redis client failed: ${error}`
		if (config.env.NODE_ENV !== 'test') {
			logger.error(err)
		}
		throw err
	}
}

export const closeRedisClient: Disposer<Redis> = (redis) => {
	return new Promise((resolve, reject) => {
		redis.quit((err, result) => {
			if (err) return reject(err)
			return resolve(result)
		})
	})
}

export const getRedisClientOpts = (env: Env): Config['redis'] => ({
	REDIS_URL: env.REDIS_URL,
	REDIS_ENABLE_AUTO_PIPELINING: env.REDIS_ENABLE_AUTO_PIPELINING,
	REDIS_MAX_RETRIES_PER_REQ: env.REDIS_MAX_RETRIES_PER_REQ,
	REDIS_CONNECT_TIMEOUT: env.REDIS_CONNECT_TIMEOUT,
})

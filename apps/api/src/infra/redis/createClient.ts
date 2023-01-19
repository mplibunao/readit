import Redis from 'ioredis'
import { z } from 'zod'

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

export const createRedisClient = (opts: RedisOpts) => {
	return new Redis(opts.REDIS_URL, {
		maxRetriesPerRequest: opts.REDIS_MAX_RETRIES_PER_REQ,
		connectTimeout: opts.REDIS_CONNECT_TIMEOUT,
		enableAutoPipelining: opts.REDIS_ENABLE_AUTO_PIPELINING,
		family: 4,
	})
}

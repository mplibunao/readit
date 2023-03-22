import { Env } from '@api/infra/config'
import { z } from 'zod'

export const trpcEnvSchema = {
	TRPC_ENDPOINT: z.string(),
	TRPC_SLOW_QUERY_THRESHOLD: z
		.number()
		.int()
		.nonnegative()
		.default(200)
		.describe('Duration in MS of slow queres'),
	TRPC_MODERATELY_SLOW_QUERY_THRESHOLD: z
		.number()
		.int()
		.nonnegative()
		.default(500)
		.describe('Duration in MS of moderately slow queres'),
	TRPC_SLOWEST_QUERY_THRESHOLD: z
		.number()
		.int()
		.nonnegative()
		.default(1000)
		.describe('Duration in MS of slowest queres'),
}

export type TrpcEnvSchema = {
	endpoint: string
	slowQueryThreshold: number
	moderatelySlowQueryThreshold: number
	slowestQueryThreshold: number
}

export const getTrpcOpts = (env: Env): TrpcEnvSchema => ({
	endpoint: env.TRPC_ENDPOINT,
	slowQueryThreshold: env.TRPC_SLOW_QUERY_THRESHOLD,
	moderatelySlowQueryThreshold: env.TRPC_MODERATELY_SLOW_QUERY_THRESHOLD,
	slowestQueryThreshold: env.TRPC_SLOWEST_QUERY_THRESHOLD,
})

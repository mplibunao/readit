import FastifyRateLimit, { RateLimitPluginOptions } from '@fastify/rate-limit'
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { z } from 'zod'

import { Config, Env } from './config'

export const rateLimitEnvSchema = {
	RATELIMIT_MAX: z
		.number()
		.positive()
		.optional()
		.default(100)
		.describe('Max reqs a single client can perform inside a timeWindow'),
	RATELIMIT_TIMEWINDOW: z
		.number()
		.positive()
		.optional()
		.default(1_000 * 60)
		.describe('Time window in ms'),
}

const rateLimit: FastifyPluginAsync<RateLimitPluginOptions> = async (
	fastify,
	opts,
) => {
	fastify.register(FastifyRateLimit, {
		...opts,
		keyGenerator: (req) => {
			if (req.headers['user-agent']) {
				return `${req.ip}:${req.headers['user-agent']}`
			}

			return req.ip
		},
	})
}

export default fp(rateLimit, {
	name: 'rateLimit',
})

export const getRateLimitOpts = (env: Env): Config['rateLimit'] => ({
	max: env.RATELIMIT_MAX,
	timeWindow: env.RATELIMIT_TIMEWINDOW,
})

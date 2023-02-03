import { AppError } from '@readit/utils'
import { initTRPC, TRPCError } from '@trpc/server'
import { performance } from 'perf_hooks'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { Context } from './context'

export const t = initTRPC.context<Context>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				type: error instanceof AppError ? error.type : null,
				zodError:
					error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		}
	},
})

export const router = t.router

const logger = t.middleware(
	async ({ input, path, type, next, ctx: { logger, config } }) => {
		const { trpc } = config
		const start = performance.now()
		const result = await next()
		const durationMs = performance.now() - start

		if (durationMs >= trpc.slowestQueryThreshold) {
			logger.warn(
				`[tRPC Server] request took more than ${trpc.slowestQueryThreshold}:`,
				{
					path,
					type,
					durationMs,
					input,
					ok: result.ok,
				},
			)
			return result
		}

		if (durationMs >= trpc.moderatelySlowQueryThreshold) {
			logger.debug(
				`[tRPC Server] request took more than ${trpc.moderatelySlowQueryThreshold}:`,
				{
					path,
					type,
					durationMs,
					input,
					ok: result.ok,
				},
			)

			return result
		}

		if (durationMs >= trpc.slowQueryThreshold) {
			logger.trace(
				`[tRPC Server] request took more than ${trpc.slowQueryThreshold}:`,
				{
					path,
					type,
					durationMs,
					input,
					ok: result.ok,
				},
			)

			return result
		}

		return result
	},
)

const loggedProcedure = t.procedure.use(logger)

/**
 * Unprotected procedure
 **/
export const publicProcedure = loggedProcedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.SessionService.getUser()) {
		throw new TRPCError({ code: 'UNAUTHORIZED' })
	}

	return next()
})

/**
 * Protected procedure
 **/
export const protectedProcedure = loggedProcedure.use(isAuthed)

import { TrpcError } from '@api/utils/errors/handleTRPCServiceErrors'
import { PROTECTED_PROCEDURE_AUTH_ERROR_TYPE } from '@api/utils/errors/trpcMiddlewareErrors'
import { initTRPC } from '@trpc/server'
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
				type: error instanceof TrpcError ? error.type : null,
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
	async ({ input, path, type, next, ctx: { deps } }) => {
		const { logger, config } = deps
		const { trpc } = config
		const start = performance.now()
		const result = await next()
		const durationMs = performance.now() - start

		if (durationMs >= trpc.slowestQueryThreshold) {
			logger.warn(
				{
					path,
					type,
					durationMs,
					input,
				},
				`[tRPC Server] request took more than ${trpc.slowestQueryThreshold}:`,
			)
			return result
		}

		if (durationMs >= trpc.moderatelySlowQueryThreshold) {
			logger.debug(
				{
					path,
					type,
					durationMs,
					input,
				},
				`[tRPC Server] request took more than ${trpc.moderatelySlowQueryThreshold}:`,
			)

			return result
		}

		if (durationMs >= trpc.slowQueryThreshold) {
			logger.trace(
				{
					path,
					type,
					durationMs,
					input,
				},
				`[tRPC Server] request took more than ${trpc.slowQueryThreshold}:`,
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
	if (!ctx.session.user) {
		throw new TrpcError({
			code: 'UNAUTHORIZED',
			type: PROTECTED_PROCEDURE_AUTH_ERROR_TYPE,
		})
	}

	return next()
})

/**
 * Protected procedure
 **/
export const protectedProcedure = loggedProcedure.use(isAuthed)

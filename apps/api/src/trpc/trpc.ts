import { ApplicationError } from '@api/helpers/errors'
import { initTRPC } from '@trpc/server'
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
				type: error instanceof ApplicationError ? error.type : null,
				zodError:
					error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
						? error.cause.flatten()
						: null,
			},
		}
	},
})

export const router = t.router

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure

/**
 * Reusable middleware to ensure
 * users are logged in
 */

/*
 *const isAuthed = t.middleware(({ ctx, next }) => {
 *  if (!ctx.session || !ctx.session.user) {
 *    throw new TRPCError({ code: 'UNAUTHORIZED' })
 *  }
 *  return next({
 *    ctx: {
 *      // infers the `session` as non-nullable
 *      session: { ...ctx.session, user: ctx.session.user },
 *    },
 *  })
 *})
 */

/**
 * Protected procedure
 **/
//export const protectedProcedure = t.procedure.use(isAuthed)

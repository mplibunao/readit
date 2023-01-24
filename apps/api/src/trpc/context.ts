import { inferAsyncReturnType } from '@trpc/server'
import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

export type CreateContextOptions = {
	session?: CreateFastifyContextOptions['req']['session']
}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock Next.js' `req`/`res`
 * - tRPC's `createSSGHelpers` where we don't have `req`/`res`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export const createContextInner = async ({ session }: CreateContextOptions) => {
	return {
		session,
	}
}

/**
 * Outer context. Used in the routers and will e.g. bring `req` & `res` to the context as "not `undefined`".
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function createContext({ req }: CreateFastifyContextOptions) {
	//const user = { name: req.headers.username ?? 'anonymous' }

	//return { req, res, pg: req.server.pg }
	return await createContextInner({ session: req.session })
}

export type Context = inferAsyncReturnType<typeof createContext>

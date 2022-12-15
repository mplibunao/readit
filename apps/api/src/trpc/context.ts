import { PG } from '@api/infra/pg'
import { inferAsyncReturnType } from '@trpc/server'
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'

type CreateContextOptions = {
	pg: PG
}

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async ({ pg }: CreateContextOptions) => {
	return { pg }
}

export async function createContext({ req }: CreateFastifyContextOptions) {
	//const user = { name: req.headers.username ?? 'anonymous' }

	//return { req, res, pg: req.server.pg }
	return await createContextInner({ pg: req.server.pg })
}

export type Context = inferAsyncReturnType<typeof createContext>

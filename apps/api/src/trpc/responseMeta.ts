import { DefaultErrorShape, TRPCError } from '@trpc/server'
import { TRPCResponse } from '@trpc/server/dist/rpc'

import { Context } from './context'
import { QueryType } from './errorHandler'

export type ResponseMetaParams = {
	data: TRPCResponse<unknown, DefaultErrorShape>[]
	errors: TRPCError[]
	type: QueryType
	ctx?: Context
	paths?: string[]
}

// Set cookie
// Cache responses
export const responseMeta = ({ paths, type, errors }: ResponseMetaParams) => {
	const allOk = errors.length === 0
	const allPublic = paths && paths.every((path) => path.includes('public'))
	const isQuery = type === 'query'
	if (allOk && allPublic && isQuery) {
		const ONE_DAY_IN_SECONDS = 60 * 60 * 24
		return {
			headers: {
				'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
			},
		}
	}

	return {}
}

import { ProcedureType, TRPCError } from '@trpc/server'
import { FastifyRequest } from 'fastify'
import { ZodError } from 'zod'

import { Context } from './context'

export type QueryType = ProcedureType | 'unknown'

export type OnErrorParams = {
	error: TRPCError
	path?: string
	ctx?: Context
	input: unknown
	req: FastifyRequest
	type: QueryType
}

export const onError = ({ error, path, req, type }: OnErrorParams) => {
	if (error.code === 'INTERNAL_SERVER_ERROR') {
		req.log.fatal({ error, type }, `Something went wrong on ${path}`)
	} else if (error.code === 'BAD_REQUEST' && error.cause instanceof ZodError) {
		req.log.info(`zod validation error on ${path}`, error.cause.flatten(), {
			error,
			type,
		})
	} else {
		req.log.error({ error, type }, `Something went wrong on ${path}`)
	}
}

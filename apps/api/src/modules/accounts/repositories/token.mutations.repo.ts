import { Dependencies } from '@api/infra/diConfig'
import { TokenData, Trx } from '@api/infra/pg/types'
import { DBError } from '@readit/utils'
import { sql, UpdateResult } from 'kysely'
import { z } from 'zod'

import { createTokenSchema, CreateTokenSchema } from '../domain/token.schema'

export interface TokenMutationsRepo {
	create: (params: CreateTokenSchema) => Promise<TokenData>
	markAsUsed: (id: string, trx?: Trx) => Promise<UpdateResult>
}

export const buildTokenMutationsRepo = ({ pg, logger }: Dependencies) => {
	const create = z
		.function()
		.args(createTokenSchema)
		.implement(async (token) => {
			try {
				return await pg
					.insertInto('tokens')
					.values(token)
					.returningAll()
					.executeTakeFirstOrThrow()
			} catch (error) {
				const err = {
					cause: error,
					message: 'Database error occurred while creating token',
				}
				logger.error({ ...err, token })
				throw new DBError(err)
			}
		})

	const tokenMutationsRepo: TokenMutationsRepo = {
		create,
		async markAsUsed(id, trx) {
			const query = trx ? trx : pg
			try {
				return await query
					.updateTable('tokens')
					.where('id', '=', id)
					.set({ usedAt: sql`NOW()` })
					.executeTakeFirstOrThrow()
			} catch (error) {
				throw new DBError({
					cause: error,
					message: 'Database error occurred while marking token as used',
				})
			}
		},
	}

	return tokenMutationsRepo
}

import { Dependencies } from '@api/infra/diConfig'
import { InsertableToken, TokenData, Trx } from '@api/infra/pg/types'
import { DBError } from '@readit/utils'
import { sql, UpdateResult } from 'kysely'

export interface TokenMutationsRepo {
	create: (token: InsertableToken) => Promise<TokenData>
	markAsUsed: (id: string, trx?: Trx) => Promise<UpdateResult>
}

export const buildTokenMutationsRepo = ({ pg, logger }: Dependencies) => {
	const tokenMutationsRepo: TokenMutationsRepo = {
		async create(token) {
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
		},

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

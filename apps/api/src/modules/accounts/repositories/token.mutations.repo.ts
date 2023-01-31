import { Dependencies } from '@api/infra/diConfig'
import { InsertableToken, TokenData } from '@api/infra/pg/types'
import { DBError } from '@readit/utils'

export interface TokenMutationsRepo {
	create: (token: InsertableToken) => Promise<TokenData>
}

export const buildTokenMutationsRepo = ({ pg, logger }: Dependencies) => {
	const tokenMutationsRepo: TokenMutationsRepo = {
		async create(token) {
			try {
				return pg
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
	}

	return tokenMutationsRepo
}

import { Dependencies } from '@api/infra/diConfig'
import { TokenData } from '@api/infra/pg/types'
import { DBError } from '@readit/utils'
import { NoResultError } from 'kysely'

import { TokenNotFound } from '../domain/token.errors'

export interface TokenQueriesRepo {
	findById: (id: string) => Promise<TokenData>
}

export const buildTokenQueriesRepo = ({ pg }: Dependencies) => {
	const tokenQueriesRepo: TokenQueriesRepo = {
		async findById(id) {
			try {
				return await pg
					.selectFrom('tokens')
					.selectAll('tokens')
					.where('id', '=', id)
					.executeTakeFirstOrThrow()
			} catch (error) {
				if (error instanceof NoResultError) {
					throw new TokenNotFound({ cause: error })
				}
				throw new DBError({
					cause: error,
					message: 'Database error occurred while finding user',
				})
			}
		},
	}

	return tokenQueriesRepo
}

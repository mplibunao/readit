import { Dependencies } from '@api/infra/diConfig'
import { PG } from '@api/infra/pg/createClient'
import {
	DeleteOptions,
	DeleteQuery,
	InsertableSocialAccount,
	SelectOptions,
	SelectQuery,
	SocialAccountData,
	Trx,
	UpdateOptions,
	UpdateQuery,
} from '@api/infra/pg/types'
import {
	DBError,
	InvalidDeleteFilter,
	InvalidQueryFilter,
} from '@api/utils/errors/repoErrors'
import { NoResultError } from 'kysely'
import Pg from 'pg'

import {
	SocialAccountAlreadyExists,
	SocialAccountNotFound,
} from '../domain/oAuth.errors'

type SocialAccountDeleteQuery = DeleteQuery<'socialAccounts'>
type SocialAccountDeleteOptions = DeleteOptions<'socialAccounts'>
type SocialAccountUpdateQuery = UpdateQuery<'socialAccounts'>
type SocialAccountUpdateOptions = UpdateOptions<'socialAccounts'>
type SocialAccountQuery = SelectQuery<'socialAccounts'>
type SocialAccountFindOptions = SelectOptions<'socialAccounts'>

export class SocialAccountRepository {
	private pg: PG

	constructor(deps: Dependencies) {
		this.pg = deps.pg
	}

	private findQuery(
		{ where }: SocialAccountFindOptions,
		trx?: Trx,
	): SocialAccountQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.selectFrom('socialAccounts')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof SocialAccountData, '=', value)
		}

		return query
	}

	private removeQuery(
		{ where }: SocialAccountDeleteOptions,
		trx?: Trx,
	): SocialAccountDeleteQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidDeleteFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.deleteFrom('socialAccounts')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof SocialAccountData, '=', value)
		}

		return query
	}

	private updateQuery(
		{ where, data }: SocialAccountUpdateOptions,
		trx?: Trx,
	): SocialAccountUpdateQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.updateTable('socialAccounts').set(data)

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof SocialAccountData, '=', value)
		}

		return query
	}

	async create(data: InsertableSocialAccount, trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			return await connection
				.insertInto('socialAccounts')
				.values(data)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				throw new SocialAccountAlreadyExists({})
			}
			throw new DBError({ cause: error })
		}
	}

	async updateTakeOneOrThrow(
		options: SocialAccountUpdateOptions,
		trx?: Trx,
	): Promise<SocialAccountData> {
		try {
			return await this.updateQuery(options, trx)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new SocialAccountNotFound({ cause: error })
			}
			throw new DBError({
				cause: error,
				message: 'Database error occurred while updating social account',
			})
		}
	}

	async removeByIdOrThrow(id: string, trx?: Trx) {
		try {
			return await this.removeQuery({ where: { id } }, trx)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new SocialAccountNotFound({ cause: error })
			}
			throw new DBError({ cause: error })
		}
	}

	async findBySocialId(socialId: string, trx?: Trx) {
		try {
			return await this.findQuery({ where: { socialId } }, trx)
				.innerJoin('users', 'socialAccounts.userId', 'users.id')
				.selectAll(['socialAccounts', 'users'])
				.executeTakeFirst()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	async findByIdOrThrow(id: string, trx?: Trx) {
		try {
			return await this.findQuery({ where: { id } }, trx)
				.selectAll('socialAccounts')
				.executeTakeFirstOrThrow()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}
}

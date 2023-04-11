import { Dependencies } from '@api/infra/diConfig'
import { PG } from '@api/infra/pg/createClient'
import {
	SelectOptions,
	Trx,
	UpdateQuery,
	UserData,
	UpdateOptions,
	SelectQuery,
	InsertableUser,
} from '@api/infra/pg/types'
import { NotFound } from '@api/utils/errors/baseError'
import {
	DBError,
	InvalidQueryFilter,
	InvalidUpdateFilter,
} from '@api/utils/errors/repoErrors'
import { NoResultError, sql } from 'kysely'
import Pg from 'pg'

import { OAuthSchemas } from '../domain/oAuth.schema'
import { UserAlreadyExists, UsernameAlreadyExists } from '../domain/user.errors'

type UserFindOptions = SelectOptions<'users'>
type UserUpdateQuery = UpdateQuery<'users'>
type UserUpdateOptions = UpdateOptions<'users'>
type UserQuery = SelectQuery<'users'>

export class UserRepository {
	private pg: PG

	constructor(deps: Dependencies) {
		this.pg = deps.pg
	}

	private findQuery({ where }: UserFindOptions, trx?: Trx): UserQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidQueryFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.selectFrom('users')

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof UserData, '=', value)
		}

		return query
	}

	private updateQuery(
		{ where, data }: UserUpdateOptions,
		trx?: Trx,
	): UserUpdateQuery {
		if (Object.keys(where).length === 0) {
			throw new InvalidUpdateFilter({})
		}

		const connection = trx ? trx : this.pg
		let query = connection.updateTable('users').set(data)

		// loop over filters and add where clauses
		for (const [key, value] of Object.entries(where)) {
			query = query.where(key as keyof UserData, '=', value)
		}

		return query
	}

	async findByEmail(email: string, trx?: Trx): Promise<UserData | undefined> {
		try {
			return await this.findQuery({ where: { email } }, trx)
				.selectAll('users')
				.executeTakeFirst()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	async findByEmailOrUsernameOrThrow(
		filter: { email: string } | { username: string },
		trx?: Trx,
	): Promise<UserData> {
		try {
			return await this.findQuery({ where: filter }, trx)
				.selectAll('users')
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'User was not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	async findByIdOrThrow(id: string, trx?: Trx): Promise<UserData> {
		try {
			return await this.findQuery({ where: { id } }, trx)
				.selectAll('users')
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'User was not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	async findById(id: string, trx?: Trx) {
		try {
			return await this.findQuery({ where: { id } }, trx)
				.selectAll('users')
				.executeTakeFirst()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	async findAccountStatus(id: string, trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			const accountStatus = await connection
				.selectFrom('users')
				.where('users.id', '=', id)
				.leftJoin('socialAccounts as s', 's.userId', 'users.id')
				.selectAll('users')
				.select(
					sql<
						OAuthSchemas.SocialAccount[]
					>`COALESCE(json_agg(s.*) FILTER (WHERE s.id IS NOT NULL), '[]')`.as(
						'socialAccounts',
					),
				)
				.groupBy('users.id')
				.executeTakeFirstOrThrow()

			return accountStatus
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'User was not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	async updateTakeOne(
		options: UserUpdateOptions,
		trx?: Trx,
	): Promise<UserData | undefined> {
		try {
			return await this.updateQuery(options, trx)
				.returningAll()
				.executeTakeFirst()
		} catch (error) {
			throw new DBError({ cause: error })
		}
	}

	async updateTakeOneOrThrow(
		options: UserUpdateOptions,
		trx?: Trx,
	): Promise<UserData> {
		try {
			return await this.updateQuery(options, trx)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof NoResultError) {
				throw new NotFound({ cause: error, message: 'User was not found' })
			}
			throw new DBError({ cause: error })
		}
	}

	async create(user: InsertableUser, trx?: Trx) {
		try {
			const connection = trx ? trx : this.pg
			return await connection
				.insertInto('users')
				.values(user)
				.returningAll()
				.executeTakeFirstOrThrow()
		} catch (error) {
			if (error instanceof Pg.DatabaseError) {
				if (error.code === '23505') {
					if (error.constraint === 'users_username_key') {
						throw new UsernameAlreadyExists({ cause: error })
					}
					throw new UserAlreadyExists({ cause: error })
				}
			}
			throw new DBError({ cause: error })
		}
	}
}

import { Dependencies } from '@api/infra/diConfig'
import { InsertableUser, Trx, UserData } from '@api/infra/pg/types'
import { DBError } from '@readit/utils'
import { sql, UpdateResult } from 'kysely'
import Pg from 'pg'

import { UserAlreadyExists } from '../domain/user.errors'

export interface UserMutationsRepo {
	create: (
		user: InsertableUser,
	) => Promise<
		Pick<UserData, 'id' | 'email' | 'firstName' | 'lastName' | 'username'>
	>
	confirmUser: (id: string, trx?: Trx) => Promise<UpdateResult>
}

export const buildUserMutationsRepo = ({ pg }: Dependencies) => {
	const userMutationsRepo: UserMutationsRepo = {
		async create(user) {
			try {
				return await pg
					.insertInto('users')
					.values(user)
					.returning(['id', 'email', 'firstName', 'lastName', 'username'])
					.executeTakeFirstOrThrow()
			} catch (error) {
				if (error instanceof Pg.DatabaseError) {
					if (error.code === '23505') {
						throw new UserAlreadyExists({ cause: error })
					}
				}
				throw new DBError({
					cause: error,
					message: 'Database error occurred while creating user',
				})
			}
		},

		async confirmUser(id, trx) {
			const query = trx ? trx : pg
			try {
				return await query
					.updateTable('users')
					.where('id', '=', id)
					.set({ confirmedAt: sql`NOW()` })
					.executeTakeFirstOrThrow()
			} catch (error) {
				throw new DBError({
					cause: error,
					message: 'Database error occurred while confirming user',
				})
			}
		},
	}

	return userMutationsRepo
}

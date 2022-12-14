import { PG } from '../../infra/pg'
import { AccountsRepo } from './accounts.repo'
import { RegisterSchema } from './accounts.validation'
import argon2 from 'argon2'

export * as Accounts from './accounts.service'

export const create = async (pg: PG, { password, ...user }: RegisterSchema) => {
	const hashedPassword = await argon2.hash(password)

	return AccountsRepo.create(pg, { ...user, hashedPassword })
}

export const findUserById = async (pg: PG, id: string) => {
	return AccountsRepo.findUserById(pg, id)
}

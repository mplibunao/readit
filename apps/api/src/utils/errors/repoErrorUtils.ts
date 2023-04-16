import { NoResultError } from 'kysely'
import Pg from 'pg'

import { AlreadyExists, NotFound } from './baseError'

export function throwIfUniqueConstraintError(error: unknown, message: string) {
	if (error instanceof Pg.DatabaseError) {
		if (error.code === '23505') {
			throw new AlreadyExists({
				cause: error,
				message,
			})
		}
	}
}

export function throwIfNotFound(error: unknown, message: string) {
	if (error instanceof NoResultError) {
		throw new NotFound({ cause: error, message })
	}
}

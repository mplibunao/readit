import Pg from 'pg'

import { AlreadyExists } from './baseError'

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

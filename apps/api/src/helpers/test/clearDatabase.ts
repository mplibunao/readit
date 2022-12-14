import { db } from '../../infra/pg/client'

export const clearDatabase = async () => {
	await db.deleteFrom('users').execute()
}

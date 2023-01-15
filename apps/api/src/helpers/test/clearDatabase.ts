import { pg } from '@api/infra/pg/client'

export const clearDatabase = async () => {
	await pg.deleteFrom('users').execute()
}

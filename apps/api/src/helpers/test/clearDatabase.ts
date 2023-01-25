import { PG } from '@api/infra/pg/createClient'

export const clearDatabase = async (pg: PG) => {
	await pg.deleteFrom('users').execute()
}

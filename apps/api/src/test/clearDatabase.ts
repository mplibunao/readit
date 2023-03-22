import { PG } from '@api/infra/pg/createClient'
import type Redis from 'ioredis'

export const clearDatabase = async (pg: PG) => {
	await pg.deleteFrom('userInterests').execute()
	await pg.deleteFrom('users').execute()
	await pg.deleteFrom('tags').execute()
	await pg.deleteFrom('socialAccounts').execute()
	await pg.deleteFrom('communities').execute()
	await pg.deleteFrom('communityTags').execute()
	await pg.deleteFrom('memberships').execute()
}

export const clearRedis = async (redis: Redis) => {
	await redis.flushall()
}

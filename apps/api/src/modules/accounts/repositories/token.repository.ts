import { Dependencies } from '@api/infra/diConfig'
import { AbstractRedisEntityCache } from '@api/infra/redis/abstractRedisEntityCache'

import { Token } from '../domain/token.schema'

export class TokenRepository extends AbstractRedisEntityCache<Token> {
	constructor({ redis }: Dependencies) {
		super(redis, 'token')
	}
}

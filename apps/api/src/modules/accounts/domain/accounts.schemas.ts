import { buildJsonSchemas } from 'fastify-zod'

import { AccountEventsDtos } from './accounts.events.dto'

export const { schemas: accountSchemas, $ref } = buildJsonSchemas({
	...AccountEventsDtos,
})

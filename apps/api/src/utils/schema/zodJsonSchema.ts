import { pubSubPushSchema } from '@api/infra/pubsub/PubSubService'
import { confirmEmailInput } from '@api/modules/accounts/domain/email.dto'

import { buildJsonSchemas } from './buildJsonSchema'

/*
 * import all zod schemas you want to use as json schemas here
 * then use $ref for typesafety
 */
export const { schemas, $ref } = buildJsonSchemas({
	pubSubPushSchema,
	confirmEmailInput,
})

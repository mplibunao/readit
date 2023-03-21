import { pubSubPushSchema } from '@api/infra/pubsub/PubSubService'
import {
	changeEmailInput,
	confirmEmailInput,
	loginBasicAuthInput,
} from '@api/modules/accounts/dtos/email.dto'
import {
	oAuthCallbackParams,
	oAuthCallbackQs,
} from '@api/modules/accounts/dtos/user.dto'

import { buildJsonSchemas } from './buildJsonSchema'

/*
 * import all zod schemas you want to use as json schemas here
 * then use $ref for typesafety
 */
export const { schemas, $ref } = buildJsonSchemas({
	pubSubPushSchema,
	confirmEmailInput,
	loginBasicAuthInput,
	oAuthCallbackQs,
	oAuthCallbackParams,
	changeEmailInput,
})

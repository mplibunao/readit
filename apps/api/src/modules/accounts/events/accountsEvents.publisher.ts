import { Dependencies } from '@api/infra/diConfig'

import { ConfirmEmailSubscriberInput } from '../dtos/email.dto'
import { CONFIRM_EMAIL_TOPIC } from './confirmEmail.subscriber'

export interface AccountEventsPublisher {
	confirmEmail: (params: ConfirmEmailSubscriberInput) => Promise<string>
}

export const buildAccountEventsPublisher = ({
	PubSubService,
}: Dependencies) => {
	const accountEventsPublisher: AccountEventsPublisher = {
		confirmEmail: (params) => {
			return PubSubService.publishMessage(CONFIRM_EMAIL_TOPIC, params)
		},
	}

	return accountEventsPublisher
}

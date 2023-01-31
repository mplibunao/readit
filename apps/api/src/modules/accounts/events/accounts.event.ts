import { Dependencies } from '@api/infra/diConfig'

import { SendConfirmEmailInput } from '../domain/accounts.events.dto'
import { CONFIRM_EMAIL_TOPIC } from './confirmEmail.consumer'

export interface AccountEvents {
	publishConfirmEmail: (params: SendConfirmEmailInput) => Promise<string>
}

export const buildAccountEvents = ({ PubSubService }: Dependencies) => {
	const accountEvents: AccountEvents = {
		publishConfirmEmail: (params) => {
			return PubSubService.publishMessage(CONFIRM_EMAIL_TOPIC, params)
		},
	}

	return accountEvents
}

import { Dependencies } from '@api/infra/diConfig'

import { PublishRegisterUserSchema } from '../dtos/email.dto'

export interface AccountEventsPublisher {
	registerUser: (params: PublishRegisterUserSchema) => Promise<string>
}

export const accountEventsTopics = {
	registerUser: 'REGISTER_USER',
}

export const buildAccountEventsPublisher = ({
	PubSubService,
}: Dependencies) => {
	const accountEventsPublisher: AccountEventsPublisher = {
		registerUser: (params) => {
			return PubSubService.publishMessage(
				accountEventsTopics.registerUser,
				params,
			)
		},
	}

	return accountEventsPublisher
}

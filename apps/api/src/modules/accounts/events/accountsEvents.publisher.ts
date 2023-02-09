import { Dependencies } from '@api/infra/diConfig'

import {
	PublishLoginBasicAuthSchema,
	PublishRegisterUserSchema,
} from '../dtos/email.dto'

export interface AccountEventsPublisher {
	registerUser: (params: PublishRegisterUserSchema) => Promise<string>
	loginBasicAuth: (params: PublishLoginBasicAuthSchema) => Promise<string>
}

export const accountEventsTopics = {
	registerUser: 'REGISTER_USER',
	loginBasicAuth: 'LOGIN_BASIC',
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
		loginBasicAuth: (params) => {
			return PubSubService.publishMessage(
				accountEventsTopics.loginBasicAuth,
				params,
			)
		},
	}

	return accountEventsPublisher
}

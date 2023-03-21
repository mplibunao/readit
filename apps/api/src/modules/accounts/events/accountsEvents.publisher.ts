import { Dependencies } from '@api/infra/diConfig'

import {
	PublishChangeEmail,
	PublishForgotPasswordSchema,
	PublishLoginBasicAuthSchema,
	PublishRegisterUserSchema,
} from '../dtos/email.dto'

export type AccountEventsPublisher = ReturnType<
	typeof buildAccountEventsPublisher
>

export const accountEventsTopics = {
	registerUser: 'REGISTER_USER',
	loginBasicAuth: 'LOGIN_BASIC',
	changeEmail: 'CHANGE_EMAIL',
	forgotPassword: 'FORGOT_PASSWORD',
}

export const buildAccountEventsPublisher = ({
	PubSubService,
}: Dependencies) => {
	const registerUser = async (
		params: PublishRegisterUserSchema,
	): Promise<string> => {
		return await PubSubService.publishMessage(
			accountEventsTopics.registerUser,
			params,
		)
	}

	const loginBasicAuth = async (
		params: PublishLoginBasicAuthSchema,
	): Promise<string> => {
		return await PubSubService.publishMessage(
			accountEventsTopics.loginBasicAuth,
			params,
		)
	}

	const changeEmail = async (params: PublishChangeEmail): Promise<string> => {
		return await PubSubService.publishMessage(
			accountEventsTopics.changeEmail,
			params,
		)
	}

	const forgotPassword = async (
		params: PublishForgotPasswordSchema,
	): Promise<string> => {
		return await PubSubService.publishMessage(
			accountEventsTopics.forgotPassword,
			params,
		)
	}

	return {
		registerUser,
		loginBasicAuth,
		changeEmail,
		forgotPassword,
	}
}

import { z } from 'zod'

import { Dependencies } from '../diConfig'

export const pubSubPushSchema = z.object({
	message: z.object({
		data: z.string().describe('Base64 encoded string'),
		messageId: z.string(),
		message_id: z.string(),
		publish_time: z.string(),
		publishTime: z.string(),
	}),
	subscription: z
		.string()
		.describe(
			'Format: projects/{project_id}/subscriptions/{subscription_name}',
		),
})
export type PubSubPushSchema = z.infer<typeof pubSubPushSchema>

export interface PubSubService {
	publishMessage: (topic: string, message: object | string) => Promise<string>
	decodePushMessage: <T>(body: PubSubPushSchema, zodSchema?: z.ZodType<T>) => T
}

export const buildPubSubService = ({ pubsub }: Dependencies) => {
	const pubSubService: PubSubService = {
		publishMessage: async (topic, message) => {
			const messageContent =
				typeof message === 'object' ? JSON.stringify(message) : message
			const data = Buffer.from(messageContent)
			return pubsub.topic(topic).publishMessage({ data })
		},

		decodePushMessage: <T>(
			body: PubSubPushSchema,
			zodSchema?: z.ZodType<T>,
		) => {
			const message = JSON.parse(
				Buffer.from(body.message.data, 'base64').toString(),
			)
			return zodSchema ? zodSchema.parse(message) : (message as T)
		},
	}

	return pubSubService
}

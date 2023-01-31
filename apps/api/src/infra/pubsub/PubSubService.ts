import { Dependencies } from '../diConfig'

export interface PubSubService {
	publishMessage: (topic: string, message: object | string) => Promise<string>
}

export const buildPubSubService = ({ pubsub }: Dependencies) => {
	const pubSubService: PubSubService = {
		publishMessage: async (topic, message) => {
			const messageContent =
				typeof message === 'object' ? JSON.stringify(message) : message
			const data = Buffer.from(messageContent)
			return pubsub.topic(topic).publishMessage({ data })
		},
	}

	return pubSubService
}

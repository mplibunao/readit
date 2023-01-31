import { PubSub } from '@google-cloud/pubsub'

export const buildPubSubClient = () => {
	return new PubSub()
}

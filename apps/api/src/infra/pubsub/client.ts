import { PubSub } from '@google-cloud/pubsub'

import { Dependencies } from '../diConfig'

export const buildPubSubClient = ({ config }: Dependencies) => {
	return new PubSub({ projectId: config.env.GCP_PROJECT_ID })
}

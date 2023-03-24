import { asFunction, asValue } from 'awilix'

import { Config } from '../config'
import { SINGLETON_CONFIG } from '../diConfig'
import { createMockEmailClient } from './client/mockEmailClient'
import { buildPostmarkClient } from './client/postmarkClient'
import { buildPreviewEmailClient } from './client/previewEmailClient'

export const registerEmailClient = ({ env }: Config) => {
	console.info(env.IS_PROD, 'env.IS_PROD')
	if (env.IS_PROD) {
		return asFunction(buildPostmarkClient, SINGLETON_CONFIG)
	}

	// You can override the mockclient with your own implementation by creating your own mockClient when calling build
	if (env.NODE_ENV === 'test') {
		return asValue(createMockEmailClient())
	}

	return asFunction(buildPreviewEmailClient, SINGLETON_CONFIG)
}

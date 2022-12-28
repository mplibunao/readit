import { config } from '@api/config'
import { EdgeConfig } from '@readit/edge-config'
import { createClient } from '@vercel/edge-config'

import { logger } from '../logger'

export const edgeConfig = new EdgeConfig({
	client: createClient(config.edgeConfig.connectionString),
	appName: config.edgeConfig.appName,
	env: config.edgeConfig.env,
	onError: (err) => {
		logger.error(err, 'EdgeConfig operation error')
	},
})

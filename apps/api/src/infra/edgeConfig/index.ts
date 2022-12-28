import { config } from '@api/config'
import { createClient } from '@vercel/edge-config'
import { EdgeConfig } from 'edge-config'
import { logger } from '../logger'

export const edgeConfig = new EdgeConfig({
	client: createClient(config.edgeConfig.connectionString),
	appName: config.edgeConfig.appName,
	env: config.edgeConfig.env,
	onError: (err) => {
		logger.error(err, 'EdgeConfig operation error')
	},
})

import { config } from '@api/config'
import { createClient } from '@vercel/edge-config'
import { EdgeConfig } from 'edge-config'

export const edgeConfig = new EdgeConfig({
	client: createClient(config.edgeConfig.connectionString),
	logErrors: true,
	appName: config.edgeConfig.appName,
	env: config.edgeConfig.env,
})

import { EdgeConfig } from '@readit/edge-config'
import { createClient } from '@vercel/edge-config'

if (!process.env.EDGE_CONFIG) throw new Error('EDGE_CONFIG is not defined')
if (!process.env.APP_NAME) throw new Error('APP_NAME is not defined')
if (!process.env.VERCEL_ENV) throw new Error('VERCEL_ENV is not defined')

export const edgeConfig = new EdgeConfig({
	client: createClient(process.env.EDGE_CONFIG),
	env: process.env.VERCEL_ENV,
	appName: process.env.APP_NAME,
})

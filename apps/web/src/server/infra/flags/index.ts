import * as FlagModule from '@readit/flags'
import { createClient } from '@vercel/edge-config'

if (!process.env.EDGE_CONFIG) throw new Error('EDGE_CONFIG is not defined')
if (!process.env.APP_NAME) throw new Error('APP_NAME is not defined')
if (!process.env.VERCEL_ENV) throw new Error('VERCEL_ENV is not defined')

const edgeConfig = createClient(process.env.EDGE_CONFIG)
const FlagsRepo = new FlagModule.FlagsRepo(edgeConfig)
export const FlagsService = new FlagModule.FlagsService({
	env: process.env.VERCEL_ENV,
	appName: process.env.APP_NAME,
	flagsRepo: FlagsRepo,
	onError: (err) => {
		console.error(err, 'EdgeConfig operation error')
	},
})

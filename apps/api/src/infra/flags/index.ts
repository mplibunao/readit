import { config } from '@api/config'
import * as FlagModule from '@readit/flags'
import { createClient } from '@vercel/edge-config'

import { logger } from '../logger'

const edgeConfig = createClient(config.edgeConfig.connectionString)
const FlagsRepo = new FlagModule.FlagsRepo(edgeConfig)
export const FlagsService = new FlagModule.FlagsService({
	appName: config.edgeConfig.appName,
	flagsRepo: FlagsRepo,
	env: config.edgeConfig.env,
	onError: (err) => {
		logger.error(err, 'EdgeConfig operation error')
	},
})

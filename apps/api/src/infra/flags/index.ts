import { FlagsRepo, FlagsService } from '@readit/flags'
import { createClient } from '@vercel/edge-config'

import { Dependencies } from '../diConfig'

export const buildEdgeConfig = ({ config }: Dependencies) => {
	return createClient(config.edgeConfig.connectionString)
}

export const buildFlagsRepo = ({ edgeConfig }: Dependencies) => {
	return new FlagsRepo(edgeConfig)
}

export const buildFlagsService = ({
	config,
	FlagsRepo,
	logger,
}: Dependencies) => {
	return new FlagsService({
		appName: config.edgeConfig.appName,
		flagsRepo: FlagsRepo,
		env: config.edgeConfig.env,
		onError: (err) => {
			logger.error(err, 'EdgeConfig operation error')
		},
	})
}

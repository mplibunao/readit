import { FlagsRepo, FlagsService } from '@readit/flags'
import { createClient } from '@vercel/edge-config'
import { z } from 'zod'

import { Config, Env } from './config'
import { Dependencies } from './diConfig'

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
			logger.error({ err }, 'EdgeConfig operation error')
		},
	})
}

export const edgeConfigEnvSchema = {
	EDGE_CONFIG: z
		.string()
		.optional()
		.describe('Connection string for edge config'),
	VERCEL_ENV: z.enum(['production', 'preview', 'development']),
	APP_NAME: z.string(),
}

export const getEdgeConfigOpts = (env: Env): Config['edgeConfig'] => ({
	connectionString: env.EDGE_CONFIG,
	appName: env.APP_NAME,
	env: env.VERCEL_ENV,
})

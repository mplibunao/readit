import { config } from '@api/config'
import { LogConfig } from 'kysely'

//import { LogConfig } from '@readit/pg'
import { logger } from '../logger'

export const pgLogCallback: LogConfig = (event) => {
	if (config.env.IS_PROD) {
		if (event.level === 'error') {
			logger?.error(`pg error: ${event.error}`)
		}
	} else {
		if (event.level === 'query') {
			logger?.info(`pg query sql: ${event.query.sql}`)
			logger?.info(`pg query params: ${event.query.parameters}`)
		}
		if (event.level === 'error') {
			logger?.error(`pg error: ${event.error}`)
		}
	}
}

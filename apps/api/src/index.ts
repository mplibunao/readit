import closeWithGrace, { Signals } from 'close-with-grace'
import Fastify from 'fastify'

import app from './app'
import { config } from './config'
import { logger } from './infra/logger'

const main = async () => {
	// Initialize fastify
	const server = Fastify({
		...config.fastify,
		logger,
	})

	// Register your application as a normal plugin.
	server.register(app, config)

	// delay is the number of milliseconds for the graceful close to finish
	const closeListeners = closeWithGrace(
		{ delay: 5000 },
		async ({
			err,
			signal,
			manual,
		}: {
			err?: Error
			signal?: Signals
			manual?: boolean
		}) => {
			if (err) {
				server.log.error(err)
			}

			server.log.info({ signal, manual }, 'closing application')
			await server.close()
		},
	)

	server.addHook('onClose', async (_instance, done) => {
		closeListeners.uninstall()
		done()
	})

	try {
		await server.listen(config.server)
	} catch (err) {
		server.log.error(err)
		process.exit(1)
	}
}

main()

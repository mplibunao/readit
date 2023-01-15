#!/usr/bin/env node
import { randomBytes } from 'crypto'
import yargs from 'yargs'

import { setupEnv } from './env'
import { humanReadableProcessHrtime } from './helpers'
import { logger } from './logger'

process.on('uncaughtException', (err) => {
	logger.error('Uncaught execption', { err })
	process.exit(1)
})
process.on('unhandledRejection', (err) => {
	throw err
})

const start = process.hrtime()

yargs
	.command({
		command: 'secret',
		describe: 'generate a random secret',
		builder: (yargs) => {
			return yargs.options({
				bytes: {
					alias: 'b',
					describe: 'number of bytes to generate',
					type: 'number',
					default: 32,
				},
			})
		},
		handler: (argv) => {
			const secret = randomBytes(argv.bytes).toString('hex')
			logger.info(`Generated secret: ${secret}`)
		},
	})
	.command({
		command: 'init',
		describe: 'initialize the project',
		handler: async () => {
			await setupEnv(logger)
		},
	})
	//.command({
	//command: 'docker',
	//aliases: ['dc'],
	//describe: 'run docker-compose commands',
	//builder: async (yargs) => {
	//yargs.command(run(logger))
	//yargs.command(up(logger))
	//yargs.command(exec(logger))
	//yargs.command(down(logger))
	//return yargs
	//},
	//handler: (argv) => {
	//if (!argv._[1]) {
	//yargs.showHelp()
	//process.exit(0)
	//}
	//},
	//})
	.help().argv

const end = process.hrtime(start)
logger.info(`\nTask completed in ${humanReadableProcessHrtime(end)}`)

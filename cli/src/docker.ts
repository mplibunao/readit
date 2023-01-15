import { spawn } from 'child_process'
import { execSync } from 'child_process'
import * as readline from 'node:readline/promises'
import { CommandModule } from 'yargs'

import { Logger } from './logger'

const COMPOSE_FILE = '-f ../docker-compose.yml'
const SERVICES = ['postgres', 'redis']

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

export const run = (logger: Logger): CommandModule => {
	return {
		command: 'run',
		describe:
			'Runs [SERVICE] for one-off commands; Does not use ports specified in the service config by default preventing port collisions',
		builder: (yargs) => {
			return yargs
				.positional('command', {
					describe: 'The command to run inside the container',
					type: 'string',
				})
				.positional('service', {
					describe: 'The service name',
					type: 'string',
					choices: SERVICES,
				})
				.option('service-ports', {
					alias: 'p',
					describe:
						'Runs [SERVICE] with ports specificed in configuration. Use this for starting standalone services.',
					type: 'boolean',
					default: false,
				})
		},
		handler: (argv) => {
			const { 'service-ports': servicePorts } = argv
			const service = argv._[1]
			const command = argv._[2]
			const portFlag = !!servicePorts ? '--service-ports' : '--rm'

			const cmd = `docker-compose run ${portFlag} ${COMPOSE_FILE} ${service} ${command}`

			logger.info(cmd)
			execSync(cmd, { stdio: 'inherit' })
		},
	}
}

export const up = (logger: Logger): CommandModule => {
	return {
		command: 'up',
		describe: 'Builds infrastructure',
		builder: (yargs) => {
			return yargs.option('build', {
				alias: 'b',
				describe: 'rebuilds and starts infrastructure',
				type: 'boolean',
				default: false,
			})
		},
		handler: (argv) => {
			const build = argv.build ? '--build' : ''
			const cmd = `docker-compose ${COMPOSE_FILE} up ${build}`

			logger.info(cmd)
			const child = spawn('sh', ['-c', cmd], {
				stdio: 'inherit',
			})

			process.on('SIGINT', () => {
				logger.info('Stopping containers...')
				child.kill('SIGINT')
				execSync(`docker-compose down`, {
					stdio: 'inherit',
				})
			})

			process.on('SIGTERM', () => {
				logger.info('Stopping containers...')
				child.kill('SIGINT')
				execSync(`docker-compose down`, {
					stdio: 'inherit',
				})
			})
		},
	}
}

export const exec = (logger: Logger): CommandModule => {
	return {
		command: 'exec',
		describe:
			'Uses docker exec to execute a command agains a running container',
		builder: (yargs) => {
			return yargs
				.positional('command', {
					describe: 'The command to run inside the container',
					type: 'string',
				})
				.positional('service', {
					describe: 'The service name',
					type: 'string',
					choices: SERVICES,
				})
		},
		handler: (argv) => {
			const service = argv._[1]
			const command = argv._[2]
			logger.info(`docker-compose exec ${service} ${command}`)
			execSync(`docker-compose exec ${service} ${command}`, {
				stdio: 'inherit',
			})
		},
	}
}

export const down = (logger: Logger): CommandModule => {
	return {
		command: 'down',
		describe: 'stop and remove containers, networks, images, and volumes',
		builder: (yargs) => {
			return yargs.option('volume', {
				alias: 'v',
				describe: 'remove volumes',
				type: 'boolean',
				default: false,
			})
		},
		handler: async (argv) => {
			if (argv.volume) {
				const confirm = await rl.questionAsync(
					`Are you sure you want to remove volumes as well? (Y/n): `,
				)
				if (['Y', 'y', 'yes'].includes(confirm)) {
					logger.info('docker-compose down -v')
					execSync('docker-compose down -v', { stdio: 'inherit' })
					return
				} else {
					logger.info('Cancelled removing volumes')
					logger.info('docker-compose down')
					execSync('docker-compose down', { stdio: 'inherit' })
					return
				}
			}

			logger.info('docker-compose down')
			execSync('docker-compose down', { stdio: 'inherit' })
		},
	}
}

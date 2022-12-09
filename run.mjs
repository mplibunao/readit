#!/usr/bin/env zx
// <reference 'zx/globals' />
import { humanReadableProcessHrtime } from './scripts/helpers.mjs'
import util from 'node:util'
import { randomBytes } from 'crypto'

const cmd = {
	'migrate:create': {
		command: migrateCreate,
		description: 'Create a database migration',
		help: `
      ${chalk.blue.bold('Usage:')}
      - ${__filename} migrate:create [MIGRATION_NAME]

      Creates a database migration`,
	},
	secret: {
		command: secret,
		description:
			'Generates a random secret that can be used for your SECRET_KEY and more',
		help: `
      ${chalk.blue.bold('Usage:')}
      - ${__filename} secret
      - ${__filename} secret --bytes=16

      Generates a random secret that can be used for your SECRET_KEY and more

      ${chalk.blue.bold('Options:')}
      -b --bytes   Value to pass to crypto.randomBytes. Defaults to 36`,
	},
	help: {
		command: help,
		description: 'Help',
		help: `
      ${chalk.blue.bold('Usage:')}
      - ${__filename} [COMMAND] [FLAGS] --help`,
	},
}

const { _: args, ...flags } = argv

async function migrateCreate({ action, args }) {
	if (args.length === 0) {
		console.log(chalk.red('Migration name is required'))
		console.log(cmd[action].help)
		throw new Error('Migration name is required')
	}

	echo`pnpm -F api migrate create ${args}`
	await $`pnpm -F api migrate create ${args}`
}

function secret({ flags }) {
	const bytes = flags.b || flags.bytes || 64
	const secret = randomBytes(bytes).toString('hex')
	console.log(`${chalk.green('Secret generated:')} ${secret}`)
	return
}

function help() {
	console.log(`Commands:`)
	for (const service in cmd) {
		console.log(
			util.format(
				'%s%s',
				chalk.cyan.bold(service.padEnd(20)),
				cmd[service].description
			)
		)
	}
}

async function init([action, ...args], flags) {
	const start = process.hrtime()
	const params = { args, flags, action }
	let error

	try {
		if (cmd[action]?.command) {
			if (flags.h || flags.help) {
				console.log(cmd[action]?.help)
				return
			} else {
				cmd[action].command(params)
			}
		} else {
			cmd.help.command(params)
		}
	} catch (err) {
		error = err
	}

	const end = process.hrtime(start)

	console.log(`\nTask completed in ${humanReadableProcessHrtime(end)}`)
	if (error) {
		process.exit(1)
	} else {
		process.exit(0)
	}
}

await init(args, flags)

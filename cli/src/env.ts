import fs from 'fs'
import { globby } from 'globby'
import yaml from 'js-yaml'
import path from 'path'

import { Logger } from './logger'

type PnpmworkspaceYaml = { packages: string[] }

export async function setupEnv(logger: Logger) {
	const workspacesPath = '../pnpm-workspace.yaml'

	if (!fs.existsSync(workspacesPath)) {
		logger.error(`${workspacesPath} file not found`)
		return
	}

	const file = fs.readFileSync(workspacesPath, 'utf8')
	const { packages } = yaml.load(file) as PnpmworkspaceYaml

	packages.forEach(async (pkg) => {
		logger.info(`Checking for missing .env files in ${pkg}...`)
		const envExamplePathGlob = path.join('..', pkg, '.env.example')
		const envExamplePaths = await globby(envExamplePathGlob)

		envExamplePaths.forEach((envExamplePath) => {
			const envPath = envExamplePath.replace('.example', '')

			if (!fs.existsSync(envPath)) {
				fs.copyFileSync(envExamplePath, envPath)
				logger.info(`Copied ${envExamplePath} to ${envPath}`)
			} else {
				logger.info(`${envPath} already exists`)
			}
		})

		logger.info(`Checking for missing .env.test files in ${pkg}...`)
		const envExampleTestPathGlob = path.join('..', pkg, '.env.test.example')
		const envExampleTestPaths = await globby(envExampleTestPathGlob)

		envExampleTestPaths.forEach((envExampleTestPath) => {
			const envTestPath = envExampleTestPath.replace('.example', '')

			if (!fs.existsSync(envTestPath)) {
				fs.copyFileSync(envExampleTestPath, envTestPath)
				logger.info(`Copied ${envExampleTestPath} to ${envTestPath}`)
			} else {
				logger.info(`${envTestPath} already exists`)
			}
		})
	})
}

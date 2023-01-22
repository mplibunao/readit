const nextJest = require('next/jest')

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: './',
})

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
	// Add more setup options before each test is run
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	// if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
	moduleDirectories: ['node_modules', '<rootDir>/'],
	testEnvironment: 'jest-environment-jsdom',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
}

// createJestConfig returns an async function that returns a jest config -
// so instead of doing this:
// module.exports = createJestConfig(customJestConfig)

// Take the returned async function...
const asyncConfig = createJestConfig(customJestConfig)

// and wrap it...
module.exports = async () => {
	const config = await asyncConfig()
	config.transformIgnorePatterns = [
		// ...your ignore patterns
		'node_modules/(?!(.pnpm/lodash-es|lodash-es))',
	]
	return config
}

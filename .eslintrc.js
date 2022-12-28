module.exports = {
	root: true,
	// This tells ESLint to load the config from the package `eslint-config-custom`
	extends: ['@readit/eslint-config'],
	settings: {
		next: {
			rootDir: ['apps/*/'],
		},
	},
}

module.exports = {
	root: true,
	extends: ['@readit/eslint-config-server'],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	//rules: {
	//'@typescript-eslint/no-explicit-any': 'off',
	//},
}

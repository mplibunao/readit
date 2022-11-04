module.exports = {
	root: true,
	extends: ['custom-server'],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	//rules: {
	//'@typescript-eslint/no-explicit-any': 'off',
	//},
}

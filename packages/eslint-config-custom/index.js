module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['testing-library', '@typescript-eslint'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'next/core-web-vitals',
		'turbo',
		'prettier',
		'plugin:testing-library/react',
	],
	rules: {
		'@next/next/no-html-link-for-pages': 'off',
		'testing-library/no-unnecessary-act': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-empty-function': 'off',
	},
}

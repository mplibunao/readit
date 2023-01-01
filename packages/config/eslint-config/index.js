module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['testing-library', 'simple-import-sort', '@typescript-eslint'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'next/core-web-vitals',
		'turbo',
		'prettier',
		'plugin:testing-library/react',
	],
	rules: {
		'@next/next/no-html-link-for-pages': 'off',
		'testing-library/no-unnecessary-act': 'warn',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'simple-import-sort/imports': 'warn',
		'simple-import-sort/exports': 'warn',
		'@typescript-eslint/no-empty-function': 'off',
	},
}

/** @type {import("prettier").Config} */
module.exports = {
	arrowParens: 'always',
	semi: false,
	singleQuote: true,
	jsxSingleQuote: true,
	useTabs: true,
	printWidth: 80,
	trailingComma: 'all',
	endOfLine: 'lf',
	tabWidth: 2,
	plugins: [
		require('prettier-plugin-tailwindcss'),
		require('@ianvs/prettier-plugin-sort-imports'),
	],
	importOrder: ['^\\$/(.*)$', '^[../]', '^[./]'],
	importOrderSeparation: true,
	tailwindConfig: '../../packages/config/tailwind-config',
}

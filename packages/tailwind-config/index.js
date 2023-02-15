const defaultTheme = require('tailwindcss/defaultTheme')

function withOpacity(variableName) {
	return ({ opacityValue, opacityVariable }) => {
		if (opacityValue !== undefined) {
			return `rgba(var(${variableName}), ${opacityValue})`
		}

		if (opacityVariable !== undefined) {
			return `rgba(var(--color-primary), var(${opacityVariable}, 1))`
		}
		return `rgb(var(${variableName}))`
	}
}

function withPalette(palette) {
	return {
		50: withOpacity(`--${palette}-50`),
		100: withOpacity(`--${palette}-100`),
		200: withOpacity(`--${palette}-200`),
		300: withOpacity(`--${palette}-300`),
		400: withOpacity(`--${palette}-400`),
		500: withOpacity(`--${palette}-500`),
		600: withOpacity(`--${palette}-600`),
		700: withOpacity(`--${palette}-700`),
		800: withOpacity(`--${palette}-800`),
		900: withOpacity(`--${palette}-900`),
	}
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/components/**/*.{tsx,ts}',
		'./src/pages/**/*.{tsx,ts}',
		'./src/app/**/*.{tsx,ts}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				primary: withPalette('primary'),
				neutral: withPalette('neutral'),
				success: withPalette('success'),
				warning: withPalette('warning'),
				error: withPalette('error'),
				info: withPalette('info'),
			},
			textColor: {
				primary: withPalette('primary'),
				neutral: withPalette('neutral'),
				success: withPalette('success'),
				warning: withPalette('warning'),
				error: withPalette('error'),
				info: withPalette('info'),
			},
			backgroundColor: {
				primary: withPalette('primary'),
				neutral: withPalette('neutral'),
				success: withPalette('success'),
				warning: withPalette('warning'),
				error: withPalette('error'),
				info: withPalette('info'),
			},
			borderColor: {
				primary: withPalette('primary'),
				neutral: withPalette('neutral'),
				success: withPalette('success'),
				warning: withPalette('warning'),
				error: withPalette('error'),
				info: withPalette('info'),
			},
			ringColor: {
				primary: withPalette('primary'),
				neutral: withPalette('neutral'),
				success: withPalette('success'),
				warning: withPalette('warning'),
				error: withPalette('error'),
				info: withPalette('info'),
			},
			gradientColorStops: {
				primary: withPalette('primary'),
				neutral: withPalette('neutral'),
				success: withPalette('success'),
				warning: withPalette('warning'),
				error: withPalette('error'),
				info: withPalette('info'),
			},
		},
	},
	plugins: [require('@tailwindcss/forms')],
}

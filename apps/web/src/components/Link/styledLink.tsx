import { cva } from 'cva'

export const styledLink = cva([], {
	variants: {
		intent: {
			primary: 'text-primary-600 hover:text-primary-500 font-medium',
			neutral: 'text-neutral-600 hover:text-neutral-500 font-medium',
		},
	},
	defaultVariants: {
		intent: 'primary',
	},
})

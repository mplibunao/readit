import { z } from 'zod'

export const PasswordSchema = z
	.string()
	.trim()
	.superRefine((val, ctx) => {
		if (val.length < 8) {
			ctx.addIssue({
				message: 'Password should be at least 8 characters',
				code: z.ZodIssueCode.too_small,
				inclusive: true,
				type: 'string',
				minimum: 8,
			})
		}

		if (!val.match(/[a-z]/)) {
			ctx.addIssue({
				message: 'Password should contain at least one lowercase letter',
				code: z.ZodIssueCode.custom,
			})
		}

		if (!val.match(/[A-Z]/)) {
			ctx.addIssue({
				message: 'Password should contain at least one uppercase letter',
				code: z.ZodIssueCode.custom,
			})
		}

		if (!val.match(/[0-9]/)) {
			ctx.addIssue({
				message: 'Password should contain at least one number',
				code: z.ZodIssueCode.custom,
			})
		}
	})

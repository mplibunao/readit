import { z } from 'zod'

export const password = z
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
				path: ['password'],
			})
		}

		if (!val.match(/[A-Z]/)) {
			ctx.addIssue({
				message: 'Password should contain at least one uppercase letter',
				code: z.ZodIssueCode.custom,
				path: ['password'],
			})
		}

		if (!val.match(/[0-9]/)) {
			ctx.addIssue({
				message: 'Password should contain at least one number',
				code: z.ZodIssueCode.custom,
				path: ['password'],
			})
		}
	})

export const registerSchema = z.object({
	email: z.string().trim().email({ message: 'Should be a valid email' }),
	password,
	firstName: z.string().trim().min(2),
	lastName: z.string().trim().min(2),
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const userByIdInput = z.object({
	id: z.string().uuid(),
})

export type UserByIdInput = z.infer<typeof userByIdInput>

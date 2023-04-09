import {
	createdAt,
	deletedAt,
	email,
	id,
	PasswordSchema,
	updatedAt,
} from '@readit/utils/src/schemas'
import { z } from 'zod'

export * as UserSchemas from './user.schema'

export const firstName = z
	.string()
	.trim()
	.min(2, 'Please enter at least 2 characters')
export const lastName = z
	.string()
	.trim()
	.min(2, 'Please enter at least 2 characters')
export const username = z
	.string()
	.trim()
	.min(2, 'Please enter at least 2 characters')
export const password = PasswordSchema
export const profileUrl = z.string().url()
export const confirmedAt = z.coerce.date().nullable()
export const imageUrl = z.string().url().nullable()
export const onboardedAt = z.coerce.date().nullable()
export const completedOnboarding = z.coerce.boolean()

export const user = z.object({
	id,
	email,
	firstName,
	lastName,
	username,
	createdAt,
	updatedAt,
	deletedAt,
	confirmedAt,
	imageUrl,
	onboardedAt,
})

export type User = z.infer<typeof user>
export const createUserInput = z.object({
	email,
	firstName,
	lastName,
	username,
	password,
})
export type CreateUserInput = z.infer<typeof createUserInput>
export const findByIdInput = id
export type FindByIdInput = z.infer<typeof findByIdInput>
export const loginInput = z.object({
	password,
	usernameOrEmail: z.union([username, email]),
})
export type LoginInput = z.infer<typeof loginInput>
export const updateInput = z.object({
	id: id,
	user: z.object({
		email: email.optional(),
		firstName: firstName.optional(),
		lastName: lastName.optional(),
		username: username.optional(),
		imageUrl: imageUrl.optional(),
		onboardedAt: z.union([z.string(), onboardedAt]).optional(),
	}),
})
export type UpdateInput = z.infer<typeof updateInput>
export const changePasswordInput = z.union([
	z
		.object({
			userId: id,
			oldPassword: password,
			newPassword: password,
			confirmPassword: password,
			hasPassword: z.literal(true),
		})
		.superRefine(({ confirmPassword, newPassword, oldPassword }, ctx) => {
			if (oldPassword === newPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'New password cannot be the same as the old password',
					path: ['newPassword'],
				})
			}
			if (confirmPassword !== newPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Passwords do not match',
					path: ['confirmPassword'],
				})
			}
		}),
	z.object({
		userId: id,
		oldPassword: password.optional(),
		newPassword: password,
		confirmPassword: password,
		hasPassword: z.literal(false),
	}),
])
export type ChangePasswordInput = z.infer<typeof changePasswordInput>
export const requestChangeEmailInput = z.union([
	z.object({
		userId: id,
		password,
		hasPassword: z.literal(true),
		newEmail: email,
	}),
	z.object({
		userId: id,
		hasPassword: z.literal(false),
		newEmail: email,
	}),
])
export type RequestChangeEmailInput = z.infer<typeof requestChangeEmailInput>
export const forgotPasswordInput = z.union([
	z.object({
		username: username,
	}),
	z.object({
		email: email,
	}),
])

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInput>
export const resetPasswordInput = z.object({
	token: z.string(),
	newPassword: password,
})
export type ResetPasswordInput = z.infer<typeof resetPasswordInput>

export const upsertUserInterestsInput = z.object({
	tagIds: z
		.string()
		.uuid()
		.array()
		.max(10, 'You can only select up to 10 tags')
		.min(1, 'You must select at least 1 tag'),
})
export type UpsertUserInterestsInput = z.infer<typeof upsertUserInterestsInput>

import { id } from '@readit/utils'
import { z } from 'zod'

export const publishRegisterUserSchema = z.object({
	userId: id,
})
export type PublishRegisterUserSchema = z.infer<
	typeof publishRegisterUserSchema
>
export const confirmEmailInput = z.object({ token: z.string() })
export type ConfirmEmailInput = z.infer<typeof confirmEmailInput>
export const publishLoginBasicAuthSchema = z.object({
	userId: id,
})
export type PublishLoginBasicAuthSchema = z.infer<
	typeof publishLoginBasicAuthSchema
>
export const loginBasicAuthInput = z.object({ token: z.string() })
export type LoginBasicAuthInput = z.infer<typeof loginBasicAuthInput>
export const publishChangeEmail = z.object({
	userId: id,
	newEmail: z.string().email(),
})
export type PublishChangeEmail = z.infer<typeof publishChangeEmail>
export const changeEmailInput = z.object({
	newEmail: z.string().email(),
	token: z.string(),
})
export type ChangeEmailInput = z.infer<typeof changeEmailInput>
export const publishForgotPasswordSchema = z.object({ userId: id })
export type PublishForgotPasswordSchema = z.infer<
	typeof publishForgotPasswordSchema
>

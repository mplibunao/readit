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

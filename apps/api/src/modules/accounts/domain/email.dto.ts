import { id } from '@readit/utils'
import { z } from 'zod'

export const confirmEmailSubscriberInput = z.object({
	userId: id,
})
export type ConfirmEmailSubscriberInput = z.infer<
	typeof confirmEmailSubscriberInput
>
export const confirmEmailInput = z.object({ token: z.string() })
export type ConfirmEmailInput = z.infer<typeof confirmEmailInput>

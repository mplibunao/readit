import { z } from 'zod'

import { id } from './user.types'

export const sendConfirmEmailInput = z.object({
	userId: id,
})
export type SendConfirmEmailInput = z.infer<typeof sendConfirmEmailInput>

export const AccountEventsDtos = {
	sendConfirmEmailInput,
}

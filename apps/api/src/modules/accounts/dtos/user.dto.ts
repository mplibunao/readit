import { id } from '@readit/utils'
import { z } from 'zod'

import { OAuthSchemas } from '../domain/oAuth.schema'
import { UserSchemas } from '../domain/user.schema'

export * as UserDto from './user.dto'

export const findByIdInput = z.object({ id })
export const oAuthCallbackParams = z.object({
	provider: OAuthSchemas.provider,
})
export type OAuthCallbackParams = z.infer<typeof oAuthCallbackParams>
export const oAuthCallbackQs = z.object({
	code: OAuthSchemas.code,
	state: z.string(),
})
export type OAuthCallbackQs = z.infer<typeof oAuthCallbackQs>
export const updateProfileInput = z.object({
	id,
	firstName: UserSchemas.firstName,
	lastName: UserSchemas.lastName,
})
export type UpdateProfileInput = z.infer<typeof updateProfileInput>
export const accountStatus = z
	.object({
		status: z.union([
			z.literal('Unconfirmed'),
			z.literal('Active'),
			z.literal('Deactivated'),
		]),
		hasPassword: z.boolean(),
		socialAccounts: z.array(OAuthSchemas.socialAccountOutput),
	})
	.merge(UserSchemas.user)
export type AccountStatus = z.infer<typeof accountStatus>

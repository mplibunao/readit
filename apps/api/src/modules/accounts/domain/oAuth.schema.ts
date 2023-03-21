import { createdAt, email, id, updatedAt } from '@readit/utils'
import { z } from 'zod'

import { UserSchemas } from './user.schema'

export * as OAuthSchemas from './oAuth.schema'

export const code = z.string()
export const provider = z.enum(['google', 'facebook', 'discord'])
export type Provider = z.infer<typeof provider>
export const socialAccountOutput = z.object({
	id,
	provider: z.string(),
	createdAt,
	updatedAt,
	socialId: z.string(),
	userId: id,
	usernameOrEmail: z.string(),
})
export type SocialAccount = z.infer<typeof socialAccountOutput>
export const createSocialInput = z.object({
	provider,
	socialId: z.string(),
	usernameOrEmail: z.string(),
})
export type CreateSocialInput = z.infer<typeof createSocialInput>
export const googlePartialUser = z.object({
	firstName: UserSchemas.firstName,
	lastName: UserSchemas.lastName,
	email,
	imageUrl: UserSchemas.imageUrl,
})
export type GooglePartialUser = z.infer<typeof googlePartialUser>
export const facebookPartialUser = z.object({
	firstName: UserSchemas.firstName,
	lastName: UserSchemas.lastName,
	email: email.optional(),
	imageUrl: UserSchemas.imageUrl,
})
export type FacebookPartialUser = z.infer<typeof facebookPartialUser>
export const discordPartialUser = z.object({
	username: UserSchemas.username,
	imageUrl: UserSchemas.imageUrl,
	email: email.optional(),
})
export type DiscordPartialUser = z.infer<typeof discordPartialUser>
export const verifyGoogleUserOutput = z.union([
	z.object({
		user: UserSchemas.user.optional(),
		status: z.literal('loggedIn'),
	}),
	z.object({
		status: z.literal('newPartialUser'),
		user: googlePartialUser,
		social: createSocialInput,
	}),
])
export type VerifyGoogleUserOutput = z.infer<typeof verifyGoogleUserOutput>
export const verifyFacebookUserOutput = z.union([
	z.object({
		user: UserSchemas.user.optional(),
		status: z.literal('loggedIn'),
	}),
	z.object({
		status: z.literal('newPartialUser'),
		user: facebookPartialUser,
		social: createSocialInput,
	}),
])
export type VerifyFacebookUserOutput = z.infer<typeof verifyFacebookUserOutput>
export const verifyDiscordUserOutput = z.union([
	z.object({
		user: UserSchemas.user.optional(),
		status: z.literal('loggedIn'),
	}),
	z.object({
		status: z.literal('newPartialUser'),
		user: discordPartialUser,
		social: createSocialInput,
	}),
])
export type VerifyDiscordUserOutput = z.infer<typeof verifyDiscordUserOutput>
const googleToken = {
	access_token: z.string(),
	expires_in: z.number(),
	refresh_token: z.string(),
	scope: z.string(),
	id_token: z.string(),
	token_type: z.string(),
}
export const getGoogleTokenOutput = z.object(googleToken)
export type GetGoogleTokenOutput = z.infer<typeof getGoogleTokenOutput>
export const getGoogleUserInput = z.object({
	id_token: googleToken.id_token,
	access_token: googleToken.access_token,
})
export const getGoogleUserOutput = z.object({
	id: z.string(),
	email,
	verified_email: z.boolean(),
	name: z.string(),
	given_name: z.string(),
	family_name: z.string(),
	picture: z.string(),
	locale: z.string(),
})
export type GetGoogleUserOutput = z.infer<typeof getGoogleUserOutput>
export const facebookToken = {
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
}
export const getFacebookTokenOutput = z.object(facebookToken)
export type GetFacebookTokenOutput = z.infer<typeof getFacebookTokenOutput>
export const getFacebookUserOutput = z.object({
	id: z.string(),
	name: z.string(),
	first_name: z.string(),
	last_name: z.string(),
	email: email.nullable(),
	picture: z.object({
		data: z.object({
			height: z.number(),
			is_silhouette: z.boolean(),
			url: z.string(),
			width: z.number(),
		}),
	}),
})
export type GetFacebookUserOutput = z.infer<typeof getFacebookUserOutput>
export const discordToken = {
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number(),
	refresh_token: z.string(),
	scope: z.string(),
}
export const getDiscordTokenOutput = z.object(discordToken)
export type GetDiscordTokenOutput = z.infer<typeof getDiscordTokenOutput>
export const getDiscordUserOutput = z.object({
	id: z.string(),
	username: z.string(),
	discriminator: z.string(),
	avatar: z.string().nullable(),
	bot: z.boolean().optional(),
	system: z.boolean().optional(),
	mfa_enabled: z.boolean(),
	banner: z.string().nullable(),
	accent_color: z.number().nullable(),
	locale: z.string(),
	verified: z.boolean(),
	email: email.nullable(),
	flags: z.number(),
	premium_type: z.number(),
	public_flags: z.number(),
})
export type GetDiscordUserOutput = z.infer<typeof getDiscordUserOutput>
export const discordAvatarExt = z
	.enum(['png', 'jpeg', 'jpg', 'gif', 'webp'])
	.default('webp')

export const createUserWithoutPassword = z.object({
	firstName: UserSchemas.firstName,
	lastName: UserSchemas.lastName,
	email,
	imageUrl: UserSchemas.imageUrl,
	username: UserSchemas.username,
})
export const getPartialOAuthUserOutput = z.object({
	user: z.union([googlePartialUser, facebookPartialUser, discordPartialUser]),
	social: createSocialInput,
})
export const createOAuthUserInput = z.object({
	user: createUserWithoutPassword,
	social: createSocialInput,
})
export type CreateOAuthUserInput = z.infer<typeof createOAuthUserInput>
export const createOAuthUserOutput = z
	.object({
		user: UserSchemas.user,
		socialAccount: socialAccountOutput,
	})
	.optional()
export const oAuthState = z.object({
	nonce: z.string(),
	timestamp: z.number(),
	userId: z.string().optional(),
})
export type OAuthState = z.infer<typeof oAuthState>

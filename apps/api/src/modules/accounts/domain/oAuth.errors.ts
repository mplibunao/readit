import {
	ErrorOpts,
	AppError,
	InternalServerError,
} from '@api/utils/errors/baseError'
import {
	DBError,
	InvalidQueryFilter,
	InvalidUpdateFilter,
} from '@api/utils/errors/repoErrors'

import { Provider } from './oAuth.schema'

export type VerfiyAndUpsertOAuthUserError =
	| OAuthAccountNotVerified
	| DBError
	| FailedToGetOAuthUser
	| FailedToGetOAuthToken
	| InvalidQueryFilter
	| InvalidUpdateFilter
	| InternalServerError
	| SocialAccountAlreadyExists

export type UnlinkSocialAccountError =
	| DBError
	| SocialAccountNotFound
	| InternalServerError
	| SocialNotOwnedByUser

interface OAuthErrorOpts extends ErrorOpts {
	provider: Provider
}

class OAuthBaseError extends AppError {
	public readonly provider: Provider

	constructor({ provider, ...opts }: OAuthErrorOpts) {
		super(opts)
		this.provider = provider
	}
}

export class FailedToGetOAuthToken extends OAuthBaseError {
	static type = 'Failed To Get OAuth Token'

	constructor({
		message = 'There was something wrong with the OAuth provider code used for authentication',
		...opts
	}: OAuthErrorOpts) {
		super({ message, ...opts })
		this.name = FailedToGetOAuthToken.type
	}
}

export class FailedToGetOAuthUser extends OAuthBaseError {
	static type = 'Failed To Get OAuth User'

	constructor({
		message = 'Something went wrong while fetching the social provider user details',
		...opts
	}: OAuthErrorOpts) {
		super({ message, ...opts })
		this.name = FailedToGetOAuthUser.type
	}
}

export class OAuthAccountNotVerified extends OAuthBaseError {
	static type = 'OAuth Account Not Verified'

	constructor({
		message = 'Social account is not verified or not linked to a verified email address',
		...opts
	}: OAuthErrorOpts) {
		super({ message, ...opts })
		this.name = OAuthAccountNotVerified.type
	}
}

export class SocialAccountNotFound extends AppError {
	static type = 'Social Account Not Found'

	constructor({ message = 'Social account not found', ...opts }: ErrorOpts) {
		super({ message, ...opts })
		this.name = SocialAccountNotFound.type
	}
}

export class SocialAccountAlreadyExists extends AppError {
	static type = 'Social Account Already Exists'

	constructor({
		message = 'Social account already exists',
		...opts
	}: ErrorOpts) {
		super({ message, ...opts })
		this.name = SocialAccountAlreadyExists.type
	}
}

export class StateParameterMismatch extends AppError {
	static type = 'State Parameter Mismatch'

	constructor({
		message = 'State parameter mismatch. The request may have been tampered with or the user may be under attack',
		...opts
	}: ErrorOpts) {
		super({ message, ...opts })
		this.name = StateParameterMismatch.type
	}
}

export class SocialNotOwnedByUser extends AppError {
	static type = 'Social Not Owned By User'

	constructor({
		message = 'User cannot unlink social account that is not linked to their account',
		...opts
	}: ErrorOpts) {
		super({ message, ...opts })
		this.name = SocialNotOwnedByUser.type
	}
}

export class SocialAlreadyConnectedToAnotherAccount extends AppError {
	static type = 'Social Already Connected To Another Account'

	constructor({
		message = 'This social account is already connected to another account. A social account is can only be connected to one social account',
		...opts
	}: ErrorOpts) {
		super({ message, ...opts })
		this.name = SocialAlreadyConnectedToAnotherAccount.type
	}
}

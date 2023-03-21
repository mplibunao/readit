import { ColumnType, RawBuilder } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<
	Date,
	Date | string | RawBuilder,
	Date | string | RawBuilder
>

export interface Communities {
	createdAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	description: string | null
	id: Generated<string>
	isNsfw: Generated<boolean>
	name: string
	updatedAt: Generated<Timestamp>
}

export interface CommunityTags {
	communityId: string
	createdAt: Generated<Timestamp>
	id: Generated<string>
	isPrimary: Generated<boolean>
	tagId: string
	updatedAt: Generated<Timestamp>
}

export interface Memberships {
	communityId: string
	createdAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	id: Generated<string>
	role: string
	updatedAt: Generated<Timestamp>
	userId: string
}

export interface SocialAccounts {
	createdAt: Generated<Timestamp>
	id: Generated<string>
	provider: string
	socialId: string
	updatedAt: Generated<Timestamp>
	userId: string
	usernameOrEmail: string
}

export interface Tags {
	createdAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	id: Generated<string>
	isRecommended: Generated<boolean>
	name: string
	updatedAt: Generated<Timestamp>
}

export interface UserInterests {
	createdAt: Generated<Timestamp>
	id: Generated<string>
	tagId: string
	updatedAt: Generated<Timestamp>
	userId: string
}

export interface Users {
	confirmedAt: Timestamp | null
	createdAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	email: string
	firstName: string
	hashedPassword: string | null
	id: Generated<string>
	imageUrl: string | null
	isAdmin: Generated<boolean>
	lastName: string
	onboardedAt: Timestamp | null
	updatedAt: Generated<Timestamp>
	username: string
}

export interface DB {
	communities: Communities
	communityTags: CommunityTags
	memberships: Memberships
	socialAccounts: SocialAccounts
	tags: Tags
	userInterests: UserInterests
	users: Users
}

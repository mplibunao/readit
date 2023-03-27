import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Communities {
	id: Generated<string>
	createdAt: Generated<Timestamp>
	updatedAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	name: string
	description: string | null
	isNsfw: Generated<boolean>
}

export interface CommunityTags {
	id: Generated<string>
	createdAt: Generated<Timestamp>
	updatedAt: Generated<Timestamp>
	tagId: string
	communityId: string
	isPrimary: Generated<boolean>
}

export interface Memberships {
	id: Generated<string>
	createdAt: Generated<Timestamp>
	updatedAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	userId: string
	communityId: string
	role: string
}

export interface SocialAccounts {
	id: Generated<string>
	createdAt: Generated<Timestamp>
	updatedAt: Generated<Timestamp>
	socialId: string
	provider: string
	usernameOrEmail: string
	userId: string
}

export interface Tags {
	id: Generated<string>
	createdAt: Generated<Timestamp>
	updatedAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	name: string
	isRecommended: Generated<boolean>
}

export interface UserInterests {
	id: Generated<string>
	createdAt: Generated<Timestamp>
	updatedAt: Generated<Timestamp>
	userId: string
	tagId: string
}

export interface Users {
	id: Generated<string>
	createdAt: Generated<Timestamp>
	updatedAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	email: string
	username: string
	hashedPassword: string | null
	firstName: string
	lastName: string
	confirmedAt: Timestamp | null
	isAdmin: Generated<boolean>
	onboardedAt: Timestamp | null
	imageUrl: string | null
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

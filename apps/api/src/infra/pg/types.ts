import { DB } from '@readit/pg-manager'
import {
	DeleteQueryBuilder,
	DeleteResult,
	Insertable,
	Selectable,
	SelectQueryBuilder,
	Transaction,
	Updateable,
	UpdateQueryBuilder,
	UpdateResult,
} from 'kysely'
import { From } from 'kysely/dist/cjs/parser/table-parser'

export type Row = {
	[Key in keyof DB]: Selectable<DB[Key]>
}

/** Update helpers **/
export type UpdateQuery<T extends keyof DB> = UpdateQueryBuilder<
	From<DB, T>,
	T,
	T,
	UpdateResult
>
export type UpdateOptions<T extends keyof DB> = {
	where: Partial<Selectable<DB[T]>>
	data: Updateable<DB[T]>
}

/** Select helpers **/
export type SelectQuery<T extends keyof DB> = SelectQueryBuilder<
	From<DB, T>,
	T,
	{}
>
export type SelectOptions<T extends keyof DB> = {
	where: Partial<Selectable<DB[T]>>
	// select?: Array<keyof DB[T]>
}

export type DeleteQuery<T extends keyof DB> = DeleteQueryBuilder<
	From<DB, T>,
	T,
	DeleteResult
>

export type DeleteOptions<T extends keyof DB> = {
	where: Partial<Selectable<DB[T]>>
}

export type Trx = Transaction<DB>

export type UserTable = DB['users']
export type UserData = Selectable<UserTable>
export type InsertableUser = Insertable<UserTable>
export type UpdatableUser = Updateable<UserTable>

export type ProviderType = 'google' | 'discord'
export type SocialAccountTable = DB['socialAccounts']
export type SocialAccountData = Selectable<SocialAccountTable>
export type InsertableSocialAccount = Insertable<SocialAccountTable> & {
	provider: ProviderType
}
export type UpdatableSocialAccount = Updateable<SocialAccountTable> & {
	provider?: ProviderType
}

export type CommunityTable = DB['communities']
export type CommunityData = Selectable<CommunityTable>
export type InsertableCommunity = Insertable<CommunityTable>
export type UpdatableCommunity = Updateable<CommunityTable>

export type MembershipRole = 'moderator' | 'member'
export type MembershipTable = DB['memberships']
export type MembershipData = Selectable<MembershipTable>
export type InsertableMembership = Insertable<MembershipTable> & {
	role: MembershipRole
}

export type UpdatableMembership = Updateable<MembershipTable> & {
	role?: MembershipRole
}

export type TagTable = DB['tags']
export type TagData = Selectable<TagTable>
export type InsertableTag = Insertable<TagTable>
export type UpdatableTag = Updateable<TagTable>

export type CommunityTagTable = DB['communityTags']
export type CommunityTagData = Selectable<CommunityTagTable>
export type InsertableCommunityTag = Insertable<CommunityTagTable>
export type UpdatableCommunityTag = Updateable<CommunityTagTable>

export type UserInterestTable = DB['userInterests']
export type UserInterestData = Selectable<UserInterestTable>
export type InsertableUserInterest = Insertable<UserInterestTable>
export type UpdatableUserInterest = Updateable<UserInterestTable>

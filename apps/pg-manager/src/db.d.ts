import { ColumnType, RawBuilder } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<
	Date,
	Date | string | RawBuilder,
	Date | string | RawBuilder
>

export interface Tokens {
	createdAt: Generated<Timestamp>
	id: Generated<string>
	type: string
	updatedAt: Generated<Timestamp>
	usedAt: Timestamp | null
	userId: string
}

export interface Users {
	activatedAt: Timestamp | null
	createdAt: Generated<Timestamp>
	deletedAt: Timestamp | null
	email: string
	firstName: string
	hashedPassword: string
	id: Generated<string>
	lastName: string
	updatedAt: Generated<Timestamp>
	username: string
}

export interface DB {
	tokens: Tokens
	users: Users
}

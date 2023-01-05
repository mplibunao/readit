import { DB } from '@readit/pg-manager'
import { Insertable, Selectable, Updateable } from 'kysely'

export type Row = {
	[Key in keyof DB]: Selectable<DB[Key]>
}

export type UserTable = DB['users']
export type User = Selectable<UserTable>
export type InsertableUser = Insertable<UserTable>
export type UpdatableUser = Updateable<UserTable>

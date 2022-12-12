import { Insertable, Selectable, Updateable } from 'kysely'
import { DB } from './pg.generated'

export type UserTable = DB['users']
export type User = Selectable<UserTable>
export type InsertableUser = Insertable<UserTable>
export type UpdatableUser = Updateable<UserTable>

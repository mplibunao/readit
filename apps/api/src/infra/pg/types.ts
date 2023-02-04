import { DB } from '@readit/pg-manager'
import { Insertable, Selectable, Transaction, Updateable } from 'kysely'

export type Row = {
	[Key in keyof DB]: Selectable<DB[Key]>
}

export type Trx = Transaction<DB>

export type UserTable = DB['users']
export type UserData = Selectable<UserTable>
export type InsertableUser = Insertable<UserTable>
export type UpdatableUser = Updateable<UserTable>

export type TokenType = 'accountActivation'
export type TokenTable = DB['tokens']
export type TokenData = Selectable<TokenTable>
export type InsertableToken = Insertable<TokenTable> & { type: TokenType }
export type UpdatableToken = Updateable<TokenTable> & { type?: TokenType }

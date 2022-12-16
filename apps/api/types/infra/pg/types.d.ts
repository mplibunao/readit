import { Insertable, Selectable, Updateable } from 'kysely';
import { DB } from './pg.generated';
export declare type UserTable = DB['users'];
export declare type User = Selectable<UserTable>;
export declare type InsertableUser = Insertable<UserTable>;
export declare type UpdatableUser = Updateable<UserTable>;
//# sourceMappingURL=types.d.ts.map
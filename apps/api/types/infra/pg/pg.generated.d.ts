import { ColumnType, RawBuilder } from 'kysely';
export declare type Generated<T> = T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>;
export declare type Timestamp = ColumnType<Date, Date | string | RawBuilder, Date | string | RawBuilder>;
export interface Users {
    createdAt: Generated<Timestamp>;
    deactivatedAt: Timestamp | null;
    email: string;
    firstName: string;
    hashedPassword: string;
    id: Generated<string>;
    lastName: string;
    updatedAt: Generated<Timestamp>;
}
export interface DB {
    users: Users;
}
//# sourceMappingURL=pg.generated.d.ts.map
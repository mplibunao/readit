import { ColumnType, RawBuilder } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string | RawBuilder, Date | string | RawBuilder>;

export interface Users {
  created_at: Generated<Timestamp>;
  deactivated_at: Timestamp | null;
  email: string;
  first_name: string;
  hashed_password: string;
  id: Generated<string>;
  last_name: string;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  users: Users;
}

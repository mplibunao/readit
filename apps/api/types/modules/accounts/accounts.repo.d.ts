import { InsertableUser, PG, User } from '@/infra/pg';
import { ResultAsync } from 'neverthrow';
import { FindUserByIdError, RegistrationError } from './accounts.errors';
export * as AccountsRepo from './accounts.repo';
export declare const create: (pg: PG, user: InsertableUser) => ResultAsync<Partial<User>, RegistrationError>;
export declare const findUserById: (pg: PG, id: string) => ResultAsync<Partial<User>, FindUserByIdError>;
//# sourceMappingURL=accounts.repo.d.ts.map
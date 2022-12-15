import { RegisterSchema } from './accounts.validation';
import { PG } from '@/infra/pg';
export * as Accounts from './accounts.service';
export declare const create: (pg: PG, { password, ...user }: RegisterSchema) => Promise<import("neverthrow").Result<Partial<import("@/infra/pg").User>, import("./accounts.errors").RegistrationError>>;
export declare const findUserById: (pg: PG, id: string) => Promise<import("neverthrow").Result<Partial<import("@/infra/pg").User>, import("./accounts.errors").FindUserByIdError>>;
//# sourceMappingURL=accounts.service.d.ts.map
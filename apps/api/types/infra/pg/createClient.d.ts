import { FastifyBaseLogger } from 'fastify';
import { Kysely, Selectable } from 'kysely';
import { PoolConfig } from 'pg';
import pino, { Logger } from 'pino';
import { DB } from './pg.generated';
export declare type PG = Kysely<DB>;
export interface PgOpts extends PoolConfig {
    isProd: boolean;
}
export declare const createPgClient: (opts: PgOpts, logger?: FastifyBaseLogger | Logger<pino.LoggerOptions> | Console) => Kysely<DB>;
export declare type Row = {
    [Key in keyof DB]: Selectable<DB[Key]>;
};
//# sourceMappingURL=createClient.d.ts.map
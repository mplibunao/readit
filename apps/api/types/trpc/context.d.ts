import { PG } from '@/infra/pg';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
declare type CreateContextOptions = {
    pg: PG;
};
export declare const createContextInner: ({ pg }: CreateContextOptions) => Promise<{
    pg: PG;
}>;
export declare function createContext({ req }: CreateFastifyContextOptions): Promise<{
    pg: PG;
}>;
export declare type Context = inferAsyncReturnType<typeof createContext>;
export {};
//# sourceMappingURL=context.d.ts.map
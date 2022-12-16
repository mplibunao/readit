import { TRPCError } from '@trpc/server';
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/dist/rpc';
export declare class ApplicationError extends TRPCError {
    readonly type: string;
    constructor(opts: {
        cause?: unknown;
        code: TRPC_ERROR_CODE_KEY;
        message?: string;
        type: string;
    });
}
export declare class DatabaseError extends ApplicationError {
    constructor(cause: unknown);
}
//# sourceMappingURL=index.d.ts.map
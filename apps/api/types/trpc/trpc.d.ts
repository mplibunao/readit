export declare const t: {
    _config: import("@trpc/server").RootConfig<{
        ctx: {
            pg: import("../infra/pg").PG;
        };
        meta: {};
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").CombinedDataTransformer;
    }>;
    procedure: import("@trpc/server").ProcedureBuilder<{
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                pg: import("../infra/pg").PG;
            };
            meta: {};
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").CombinedDataTransformer;
        }>;
        _ctx_out: {
            pg: import("../infra/pg").PG;
        };
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
        _meta: {};
    }>;
    middleware: <TNewParams extends import("@trpc/server").ProcedureParams<import("@trpc/server").AnyRootConfig, unknown, unknown, unknown, unknown, unknown, unknown>>(fn: import("@trpc/server").MiddlewareFunction<{
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                pg: import("../infra/pg").PG;
            };
            meta: {};
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").CombinedDataTransformer;
        }>;
        _ctx_out: {
            pg: import("../infra/pg").PG;
        };
        _input_out: unknown;
        _input_in: unknown;
        _output_in: unknown;
        _output_out: unknown;
        _meta: {};
    }, TNewParams>) => import("@trpc/server").MiddlewareFunction<{
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                pg: import("../infra/pg").PG;
            };
            meta: {};
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").CombinedDataTransformer;
        }>;
        _ctx_out: {
            pg: import("../infra/pg").PG;
        };
        _input_out: unknown;
        _input_in: unknown;
        _output_in: unknown;
        _output_out: unknown;
        _meta: {};
    }, TNewParams>;
    router: <TProcRouterRecord extends import("@trpc/server").ProcedureRouterRecord>(procedures: TProcRouterRecord) => import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {
            pg: import("../infra/pg").PG;
        };
        meta: {};
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").CombinedDataTransformer;
    }>, TProcRouterRecord>;
    mergeRouters: typeof import("@trpc/server").mergeRoutersGeneric;
};
export declare const router: <TProcRouterRecord extends import("@trpc/server").ProcedureRouterRecord>(procedures: TProcRouterRecord) => import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        pg: import("../infra/pg").PG;
    };
    meta: {};
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").CombinedDataTransformer;
}>, TProcRouterRecord>;
export declare const publicProcedure: import("@trpc/server").ProcedureBuilder<{
    _config: import("@trpc/server").RootConfig<{
        ctx: {
            pg: import("../infra/pg").PG;
        };
        meta: {};
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").CombinedDataTransformer;
    }>;
    _ctx_out: {
        pg: import("../infra/pg").PG;
    };
    _input_in: typeof import("@trpc/server").unsetMarker;
    _input_out: typeof import("@trpc/server").unsetMarker;
    _output_in: typeof import("@trpc/server").unsetMarker;
    _output_out: typeof import("@trpc/server").unsetMarker;
    _meta: {};
}>;
//# sourceMappingURL=trpc.d.ts.map
export declare const uptimeRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        pg: import("../../infra/pg").PG;
    };
    meta: {};
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").CombinedDataTransformer;
}>, {
    uptime: import("@trpc/server").BuildProcedure<"query", {
        _config: import("@trpc/server").RootConfig<{
            ctx: {
                pg: import("../../infra/pg").PG;
            };
            meta: {};
            errorShape: import("@trpc/server").DefaultErrorShape;
            transformer: import("@trpc/server").CombinedDataTransformer;
        }>;
        _ctx_out: {
            pg: import("../../infra/pg").PG;
        };
        _input_in: typeof import("@trpc/server").unsetMarker;
        _input_out: typeof import("@trpc/server").unsetMarker;
        _output_in: typeof import("@trpc/server").unsetMarker;
        _output_out: typeof import("@trpc/server").unsetMarker;
        _meta: {};
    }, {
        uptime: number;
    }>;
}>;
export declare type AppRouter = typeof appRouter;
export declare const appRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
    ctx: {
        pg: import("../../infra/pg").PG;
    };
    meta: {};
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").CombinedDataTransformer;
}>, {
    user: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {
            pg: import("../../infra/pg").PG;
        };
        meta: {};
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").CombinedDataTransformer;
    }>, {
        register: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    pg: import("../../infra/pg").PG;
                };
                meta: {};
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").CombinedDataTransformer;
            }>;
            _meta: {};
            _ctx_out: {
                pg: import("../../infra/pg").PG;
            };
            _input_in: {
                password: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            _input_out: {
                password: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, Partial<import("../../infra/pg").User>>;
        byId: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    pg: import("../../infra/pg").PG;
                };
                meta: {};
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").CombinedDataTransformer;
            }>;
            _meta: {};
            _ctx_out: {
                pg: import("../../infra/pg").PG;
            };
            _input_in: {
                id: string;
            };
            _input_out: {
                id: string;
            };
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
        }, Partial<import("../../infra/pg").User>>;
    }>;
    uptime: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
        ctx: {
            pg: import("../../infra/pg").PG;
        };
        meta: {};
        errorShape: import("@trpc/server").DefaultErrorShape;
        transformer: import("@trpc/server").CombinedDataTransformer;
    }>, {
        uptime: import("@trpc/server").BuildProcedure<"query", {
            _config: import("@trpc/server").RootConfig<{
                ctx: {
                    pg: import("../../infra/pg").PG;
                };
                meta: {};
                errorShape: import("@trpc/server").DefaultErrorShape;
                transformer: import("@trpc/server").CombinedDataTransformer;
            }>;
            _ctx_out: {
                pg: import("../../infra/pg").PG;
            };
            _input_in: typeof import("@trpc/server").unsetMarker;
            _input_out: typeof import("@trpc/server").unsetMarker;
            _output_in: typeof import("@trpc/server").unsetMarker;
            _output_out: typeof import("@trpc/server").unsetMarker;
            _meta: {};
        }, {
            uptime: number;
        }>;
    }>;
}>;
//# sourceMappingURL=index.d.ts.map
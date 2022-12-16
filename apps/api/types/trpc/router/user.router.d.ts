export declare const userRouter: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
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
//# sourceMappingURL=user.router.d.ts.map
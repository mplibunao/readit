import { UnderPressure } from '@/infra/healthcheck';
import { LoggerOpts } from '../infra/logger/loggerConfig';
import { Static } from '@sinclair/typebox';
import { PinoLoggerOptions } from 'fastify/types/logger';
import { PgOpts } from '@/infra/pg';
declare const envJsonSchema: import("@sinclair/typebox").TObject<{
    NODE_ENV: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"development">, import("@sinclair/typebox").TLiteral<"test">, import("@sinclair/typebox").TLiteral<"production">]>;
    PORT: import("@sinclair/typebox").TNumber;
    CI: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    API_HOST: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    IS_PROD: import("@sinclair/typebox").TBoolean;
    FRONTEND_URL: import("@sinclair/typebox").TString<string>;
    REDIS_URL: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    REDIS_ENABLE_AUTO_PIPELINING: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    REDIS_MAX_RETRIES_PER_REQ: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    REDIS_CONNECT_TIMEOUT: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    PG_IDLE_TIMEOUT_MS: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    PG_SSL: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    DATABASE_URL: import("@sinclair/typebox").TString<string>;
    TRPC_ENDPOINT: import("@sinclair/typebox").TString<string>;
    TRPC_PLAYGROUND_ENDPOINT: import("@sinclair/typebox").TString<string>;
    TRPC_ENABLE_PLAYGROUND: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    IS_GCP_CLOUD_RUN: import("@sinclair/typebox").TBoolean;
    APP_NAME: import("@sinclair/typebox").TString<string>;
    APP_VERSION: import("@sinclair/typebox").TString<string>;
    LOGGING_LEVEL: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"fatal">, import("@sinclair/typebox").TLiteral<"error">, import("@sinclair/typebox").TLiteral<"warn">, import("@sinclair/typebox").TLiteral<"info">, import("@sinclair/typebox").TLiteral<"debug">, import("@sinclair/typebox").TLiteral<"trace">]>;
    HEALTHCHECK_URL: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString<string>>;
    HEALTHCHECK_MAX_HEAP_USED: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    HEALTHCHECK_MAX_RSS: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    HEALTHCHECK_MAX_EVENT_LOOP_UTILIZATION: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    HEALTHCHECK_MAX_EVENT_LOOP_DELAY: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    ENABLE_HTTP2: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
export declare type Env = Static<typeof envJsonSchema>;
export interface Config {
    env: Env;
    app: {
        version: string;
        name: string;
    };
    fastify: {
        http2?: boolean;
        trustProxy: boolean;
        logger: PinoLoggerOptions;
        maxParamLength?: number;
    };
    server: {
        host?: string;
        port: number;
    };
    loggerOpts: LoggerOpts;
    trpc: {
        endpoint: string;
        playgroundEndpoint: string;
        enablePlayground?: boolean;
    };
    pg: PgOpts;
    underPressure: UnderPressure;
}
export declare const config: Config;
export {};
//# sourceMappingURL=index.d.ts.map
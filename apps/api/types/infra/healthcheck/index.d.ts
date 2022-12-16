/// <reference types="node" />
import underPressure from '@fastify/under-pressure';
import { FastifyPluginAsync } from 'fastify';
import { Config } from '@/config';
export declare const routeResponseSchemaOpts: {
    version: {
        type: string;
    };
    timestamp: {
        type: string;
        format: string;
    };
    db: {
        type: string;
    };
    metrics: {
        type: string;
        properties: {
            eventLoopDelay: {
                type: string;
            };
            rssBytes: {
                type: string;
            };
            heapUsed: {
                type: string;
            };
            eventLoopUtilized: {
                type: string;
            };
        };
    };
};
export interface UnderPressure extends underPressure.UnderPressureOptions {
    version: string;
}
export declare const healthCheck: FastifyPluginAsync<Config>;
declare const _default: FastifyPluginAsync<Config, import("http").Server, import("fastify").FastifyTypeProviderDefault>;
export default _default;
//# sourceMappingURL=index.d.ts.map
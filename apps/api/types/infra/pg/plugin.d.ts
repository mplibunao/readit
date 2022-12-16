/// <reference types="node" />
import { FastifyPluginAsync } from 'fastify';
import { PG, PgOpts } from './createClient';
declare module 'fastify' {
    interface FastifyInstance {
        pg: PG;
    }
}
export declare const kyselyPg: FastifyPluginAsync<PgOpts>;
declare const _default: FastifyPluginAsync<PgOpts, import("http").Server, import("fastify").FastifyTypeProviderDefault>;
export default _default;
//# sourceMappingURL=plugin.d.ts.map
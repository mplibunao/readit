/// <reference types="node" />
import { Config } from '@/config';
declare function build(opts?: {
    config?: Partial<Config>;
}): Promise<import("fastify").FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyBaseLogger, import("fastify").FastifyTypeProviderDefault>>;
export { build };
//# sourceMappingURL=build.d.ts.map
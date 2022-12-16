import { Env } from '@/config';
import { PinoLoggerOptions } from 'fastify/types/logger';
export declare type LoggerOpts = {
    IS_GCP_CLOUD_RUN: Env['IS_GCP_CLOUD_RUN'];
    LOGGING_LEVEL: Env['LOGGING_LEVEL'];
    IS_PROD: Env['IS_PROD'];
};
export declare const getLoggerConfig: (opts: LoggerOpts) => PinoLoggerOptions;
//# sourceMappingURL=loggerConfig.d.ts.map
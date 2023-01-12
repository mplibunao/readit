import { BaseLogger, LoggerOptions } from 'pino'
import { z } from 'zod'

export declare const loggerOptsEnvSchema: {
	APP_NAME: z.ZodString
	APP_VERSION: z.ZodDefault<z.ZodString>
	K_SERVICE: z.ZodOptional<z.ZodString>
	LOGGING_LEVEL: z.ZodDefault<
		z.ZodEnum<['fatal', 'error', 'warn', 'info', 'debug', 'trace']>
	>
	IS_PROD: z.ZodBoolean
}
declare const loggerOptsSchema: z.ZodObject<
	{
		APP_NAME: z.ZodString
		APP_VERSION: z.ZodDefault<z.ZodString>
		K_SERVICE: z.ZodOptional<z.ZodString>
		LOGGING_LEVEL: z.ZodDefault<
			z.ZodEnum<['fatal', 'error', 'warn', 'info', 'debug', 'trace']>
		>
		IS_PROD: z.ZodBoolean
	},
	'strip',
	z.ZodTypeAny,
	{
		K_SERVICE?: string | undefined
		APP_NAME: string
		APP_VERSION: string
		LOGGING_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
		IS_PROD: boolean
	},
	{
		APP_VERSION?: string | undefined
		K_SERVICE?: string | undefined
		LOGGING_LEVEL?:
			| 'fatal'
			| 'error'
			| 'warn'
			| 'info'
			| 'debug'
			| 'trace'
			| undefined
		APP_NAME: string
		IS_PROD: boolean
	}
>
export type LoggerOpts = z.infer<typeof loggerOptsSchema>
export declare const getLoggerConfig: (
	opts: LoggerOpts,
) => Partial<LoggerOptions>
export type Logger = BaseLogger
export declare const getLogger: (opts: LoggerOpts) => Logger
export {}
//# sourceMappingURL=index.d.ts.map

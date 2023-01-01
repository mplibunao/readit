import pino, { LoggerOptions } from 'pino'

export interface LoggerOpts {
	IS_GCP_CLOUD_RUN: boolean
	LOGGING_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
	IS_PROD: boolean
	APP_NAME: string
	APP_VERSION?: string
}

interface ErrorReportingFields {
	'@type': string
	serviceContext: {
		service: string
		version?: string
	}
}

export const getLoggerConfig = (opts: LoggerOpts): Partial<LoggerOptions> => {
	if (opts.IS_GCP_CLOUD_RUN) {
		// https://cloud.google.com/error-reporting/docs/formatting-error-messages
		const errorReportingFields: ErrorReportingFields = {
			'@type':
				'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
			serviceContext: {
				service: opts.APP_NAME,
			},
		}
		if (opts.APP_VERSION) {
			errorReportingFields.serviceContext.version = opts.APP_VERSION
		}

		return {
			level: 'info',
			messageKey: 'message',
			timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
			formatters: {
				// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
				level(label: string, _number: number): object {
					switch (label) {
						case 'debug':
						case 'info':
						case 'error':
							return { severity: label.toUpperCase(), ...errorReportingFields }
						case 'warn':
							return { severity: 'WARNING' }
						case 'fatal':
							return { severity: 'CRITICAL', ...errorReportingFields }
						default:
							return { severity: 'DEFAULT' }
					}
				},
				bindings(_bindings) {
					return {}
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				log(obj: any): any {
					const { req, res, responseTime, ...driver } = obj
					// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#HttpRequest
					// https://cloud.google.com/logging/docs/structured-logging
					if (req != null) {
						driver.httpRequest = driver.httpRequest || {}
						driver.httpRequest.requestMethod = req.method
						driver.httpRequest.requestUrl =
							(req.raw.socket.encrypted ? 'https://' : 'http://') +
							req.hostname +
							req.url
						driver.httpRequest.remoteIp = req.ip
						driver.httpRequest.userAgent = req.headers['user-agent']
					}

					if (res != null) {
						driver.httpRequest = driver.httpRequest || {}
						driver.httpRequest.status = res.statusCode
						driver.httpRequest.latency = responseTime / 1000
					}

					return driver
				},
			},
		}
	}

	if (opts.IS_PROD) {
		return {
			level: opts.LOGGING_LEVEL,
		}
	}

	return {
		level: opts.LOGGING_LEVEL,
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
	}
}

export const getLogger = (opts: LoggerOpts): pino.BaseLogger => {
	return pino(getLoggerConfig(opts))
}

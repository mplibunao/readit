import { Env } from '@/config'
import { PinoLoggerOptions } from 'fastify/types/logger'

export type LoggerOpts = {
	IS_GCP_CLOUD_RUN: Env['IS_GCP_CLOUD_RUN']
	LOGGING_LEVEL: Env['LOGGING_LEVEL']
	IS_PROD: Env['IS_PROD']
}

export const getLoggerConfig = (opts: LoggerOpts): PinoLoggerOptions => {
	if (opts.IS_GCP_CLOUD_RUN) {
		return {
			level: 'info',
			messageKey: 'message',
			timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
			formatters: {
				level(label, _number): object {
					switch (label) {
						case 'debug':
						case 'info':
						case 'error':
							return { severity: label.toUpperCase() }
						case 'warn':
							return { severity: 'WARNING' }
						case 'fatal':
							return { severity: 'CRITICAL' }
						default:
							return { severity: 'DEFAULT' }
					}
				},
				bindings(_bindings) {
					return {}
				},
				log(obj: any): any {
					const { req, res, responseTime, ...driver } = obj
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

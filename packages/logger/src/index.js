'use strict'
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod }
	}
Object.defineProperty(exports, '__esModule', { value: true })
exports.getLogger =
	exports.getLoggerConfig =
	exports.loggerOptsEnvSchema =
		void 0
const pino_1 = __importDefault(require('pino'))
const zod_1 = require('zod')
exports.loggerOptsEnvSchema = {
	APP_NAME: zod_1.z.string(),
	APP_VERSION: zod_1.z.string().default('0.0.0'),
	K_SERVICE: zod_1.z.string().optional(),
	LOGGING_LEVEL: zod_1.z
		.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
		.default('info'),
	IS_PROD: zod_1.z.boolean(),
}
const loggerOptsSchema = zod_1.z.object(exports.loggerOptsEnvSchema)
const getLoggerConfig = (opts) => {
	try {
		loggerOptsSchema.parse(opts)
	} catch (error) {
		throw new Error(
			'Failed getting logger config due to argument validation error',
			{ cause: error },
		)
	}
	if (opts.K_SERVICE) {
		const errorReportingFields = {
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
				level(label, _number) {
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
				log(obj) {
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
exports.getLoggerConfig = getLoggerConfig
const getLogger = (opts) => {
	return (0, pino_1.default)((0, exports.getLoggerConfig)(opts))
}
exports.getLogger = getLogger
//# sourceMappingURL=index.js.map

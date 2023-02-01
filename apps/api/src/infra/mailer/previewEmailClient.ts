import { Options } from 'preview-email'

import { Dependencies } from '../diConfig'
import { EmailClient } from './postmarkClient'

type CustomOptions = Options & { openSimulator?: boolean }

export const buildPreviewEmailClient = ({ logger }: Dependencies) => {
	const previewEmailClient: EmailClient = {
		sendEmail: async ({ data, templateAlias, ...props }) => {
			try {
				// Injecting this module fails if it's async so we either have to import at top or lazy-load in the actual methods
				// Since this is just used in dev, it's okay load slowly or repeatedly
				const { default: previewEmail } = await import('preview-email')
				await previewEmail(
					{
						...props,
						subject: `Preview of ${templateAlias}`,
						html: `Data: ${JSON.stringify(data)}`,
					},
					{ openSimulator: false } as CustomOptions,
				)
				return 'ok'
			} catch (error) {
				logger.error('Failed to send email', { error })
				throw error
			}
		},
	}

	return previewEmailClient
}

import { Options } from 'preview-email'

import { Dependencies } from '../diConfig'
import { EmailClient } from './postmarkClient'

type CustomOptions = Options & { openSimulator?: boolean }

export const buildPreviewEmailClient = async ({ logger }: Dependencies) => {
	const { default: previewEmail } = await import('preview-email')
	const previewEmailClient: EmailClient = {
		sendEmail: async ({ data, templateAlias, ...props }) => {
			try {
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

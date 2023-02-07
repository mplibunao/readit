import { EmailClient } from './postmarkClient'

export const createMockEmailClient = (
	emailClient: Partial<EmailClient> = {},
) => {
	const mockEmailClient: EmailClient = {
		sendEmailWithTemplate: async () => {
			return 'ok'
		},
		sendEmail: async () => {
			return 'ok'
		},
		...emailClient,
	}

	return mockEmailClient
}

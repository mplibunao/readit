import { EmailClient } from './postmarkClient'

export const createMockEmailClient = (
	emailClient: Partial<EmailClient> = {},
) => {
	const mockEmailClient: EmailClient = {
		sendEmail: async () => {
			return 'ok'
		},
		...emailClient,
	}

	return mockEmailClient
}

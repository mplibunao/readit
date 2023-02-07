import { Env } from '@api/infra/config'
import { Dependencies } from '@api/infra/diConfig'
import postmark from 'postmark'
import { z } from 'zod'

import { PostmarkError } from '../email.errors'

export const postmarkEnvSchema = {
	POSTMARK_API_TOKEN: z.string(),
	FROM_SUPPORT_EMAIL: z.string(),
	FROM_ALERTS_EMAIL: z.string(),
}
const postmarkConfig = z.object(postmarkEnvSchema)
export type PostmarkConfig = z.infer<typeof postmarkConfig>
export const getPostmarkOpts = ({
	POSTMARK_API_TOKEN,
	FROM_SUPPORT_EMAIL,
	FROM_ALERTS_EMAIL,
}: Env): PostmarkConfig => ({
	POSTMARK_API_TOKEN,
	FROM_SUPPORT_EMAIL,
	FROM_ALERTS_EMAIL,
})

export interface EmailClient {
	sendEmailWithTemplate: (props: {
		from: string
		to: string
		data: object
		templateAlias: string
		cc?: string
		bcc?: string
	}) => Promise<'ok'>
	sendEmail: (props: {
		from: string
		to: string
		subject: string
		html: string
		text: string
		cc?: string
		bcc?: string
	}) => Promise<'ok'>
}

export const buildPostmarkClient = ({ config, logger }: Dependencies) => {
	const client = new postmark.ServerClient(config.postmark.POSTMARK_API_TOKEN)

	const postmarkClient: EmailClient = {
		sendEmailWithTemplate: async (props) => {
			try {
				await client.sendEmailWithTemplate({
					From: props.from,
					To: props.to,
					TrackOpens: true,
					TemplateAlias: props.templateAlias,
					TemplateModel: props.data,
					Cc: props.cc,
					Bcc: props.bcc,
				})

				return 'ok'
			} catch (error) {
				logger.error('Sending email through postmark failed', { error })
				throw new PostmarkError({
					cause: error,
				})
			}
		},

		sendEmail: async (props) => {
			try {
				await client.sendEmail({
					From: props.from,
					To: props.to,
					Subject: props.subject,
					TrackOpens: true,
					Cc: props.cc,
					Bcc: props.bcc,
					HtmlBody: props.html,
					TextBody: props.text,
				})
				return 'ok'
			} catch (error) {
				logger.error('Sending email through postmark failed', { error })
				throw new PostmarkError({
					cause: error,
				})
			}
		},
	}

	return postmarkClient
}

import { User, username } from '@api/modules/accounts/domain/user.types'
import { capitalize, getFullName } from '@api/utils/string'
import { z } from 'zod'

import { Dependencies } from '../diConfig'
import { reverse } from '../reverse-routes'

const to = z.string().email()

export interface MailerService {
	sendConfirmEmail: (
		user: User.UserSchema & { profileUrl: string },
	) => Promise<'ok'>
}

export const buildMailerService = ({
	emailClient,
	config,
	TokenMutationsRepo,
}: Dependencies) => {
	const { env } = config
	const product_url = env.FRONTEND_URL
	const product_name = capitalize(config.app.name)
	const company_name = `${product_name} Inc.`
	const company_address = 'Manila, Philippines'

	const handleSendConfirmEmail = z
		.function()
		.args(
			z.object({
				to,
				data: z.object({
					product_url: z.string(),
					product_name: z.string(),
					name: z.string(),
					action_url: z.string().url(),
					login_url: z.string().url(),
					username,
					profile_url: z.string().url(),
					support_email: z.string().email(),
					sender_name: z.string(),
					company_name: z.string(),
					company_address: z.string(),
				}),
			}),
		)
		.implement((params) => {
			return emailClient.sendEmail({
				to: params.to,
				templateAlias: 'confirm_email',
				data: params.data,
				from: '',
			})
		})

	const mailerService: MailerService = {
		sendConfirmEmail: async (userWithProfile) => {
			const token = await TokenMutationsRepo.create({
				type: 'accountActivation',
				userId: userWithProfile.id,
			})
			return handleSendConfirmEmail({
				to: userWithProfile.email,
				data: {
					//action_url: `${env.API_URL}/api/confirm-email/${token.id}`,
					action_url: reverse('confirmEmail', { token: token.id }),
					company_address,
					company_name,
					name: getFullName(userWithProfile),
					product_url,
					product_name,
					login_url: `${env.FRONTEND_URL}/login`,
					profile_url: userWithProfile.profileUrl,
					sender_name: 'MP Libunao',
					support_email: env.FROM_SUPPORT_EMAIL,
					username: userWithProfile.username,
				},
			})
		},
	}

	return mailerService
}

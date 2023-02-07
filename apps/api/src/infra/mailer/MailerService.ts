import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import { capitalize, getFullName } from '@api/utils/string'
import { render } from '@react-email/render'
import { ConfirmEmail } from '@readit/emails'

import { Dependencies } from '../diConfig'
import { reverse } from '../reverse-routes'

export interface MailerService {
	sendConfirmEmail: (user: UserSchemas.User) => Promise<'ok'>
}

export const buildMailerService = ({
	emailClient,
	config,
	TokenMutationsRepo,
}: Dependencies) => {
	const productName = capitalize(config.app.name)
	const companyAddress = 'Manila, Philippines'
	const { FROM_SUPPORT_EMAIL, GCP_PUBLIC_ASSET_URL } = config.env

	const mailerService: MailerService = {
		sendConfirmEmail: async (user) => {
			const token = await TokenMutationsRepo.create({
				type: 'accountActivation',
				userId: user.id,
			})

			const confirmEmailComponent = ConfirmEmail({
				companyAddress,
				confirmUrl: reverse('confirmEmail', {
					fullUrl: true,
					args: { token: token.id },
				}),
				logoImage: `${GCP_PUBLIC_ASSET_URL}/logo.png`,
				name: getFullName(user),
				productName,
			})

			const html = render(confirmEmailComponent)
			const text = render(confirmEmailComponent, { plainText: true })

			await emailClient.sendEmail({
				html,
				from: FROM_SUPPORT_EMAIL,
				subject: 'Action Required: Confirm your email',
				to: user.email,
				text,
			})

			return 'ok'
		},
	}

	return mailerService
}

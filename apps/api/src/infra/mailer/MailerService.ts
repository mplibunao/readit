import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import { getTTL } from '@api/utils/date'
import { capitalize, getFullName } from '@api/utils/string'
import { render } from '@react-email/render'

import { Dependencies } from '../diConfig'
import { reverse } from '../reverse-routes'
import { ConfirmEmail } from './components/confirm-email'
import { LoginEmail } from './components/login'

export interface MailerService {
	sendConfirmEmail: (user: UserSchemas.User) => Promise<'ok'>
	sendLoginBasicAuth: (user: UserSchemas.User) => Promise<'ok'>
}

export const buildMailerService = ({
	emailClient,
	config,
	TokenMutationsRepo,
}: Dependencies) => {
	const productName = capitalize(config.app.name)
	const companyAddress = 'Manila, Philippines'
	const { FROM_SUPPORT_EMAIL, GCP_PUBLIC_ASSET_URL } = config.env
	const logoImage = `${GCP_PUBLIC_ASSET_URL}/logo.png`

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
				logoImage,
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

		sendLoginBasicAuth: async (user) => {
			const token = await TokenMutationsRepo.create({
				userId: user.id,
				type: 'login',
				expiresAt: getTTL(60 * 5),
			})

			const basicAuthEmail = LoginEmail({
				companyAddress,
				logoImage,
				productName,
				loginUrl: reverse('verifyLoginToken', {
					fullUrl: true,
					args: { token: token.id },
				}),
			})

			const html = render(basicAuthEmail)
			const text = render(basicAuthEmail, { plainText: true })

			await emailClient.sendEmail({
				html,
				from: FROM_SUPPORT_EMAIL,
				subject: `Login link for ${productName}`,
				to: user.email,
				text,
			})

			return 'ok'
		},
	}

	return mailerService
}

import { UserSchemas } from '@api/modules/accounts/domain/user.schema'
import {
	DAY_IN_SECONDS,
	HOUR_IN_SECONDS,
	MINUTE_IN_SECONDS,
} from '@api/utils/date'
import { capitalize, getFullName } from '@api/utils/string'
import { render } from '@react-email/render'

import { Dependencies } from '../diConfig'
import { reverse } from '../reverse-routes'
import { ChangeEmail } from './components/change-email'
import { ConfirmEmail } from './components/confirm-email'
import { EmailHasBeenChanged } from './components/email-has-been-changed'
import { ForgotPasswordEmail } from './components/forgot-password'
import { LoginEmail } from './components/login'

export type MailerService = ReturnType<typeof buildMailerService>

export const buildMailerService = ({
	emailClient,
	config,
	TokenService,
}: Dependencies) => {
	const productName = capitalize(config.app.name)
	const companyAddress = 'Manila, Philippines'
	const { FROM_SUPPORT_EMAIL, GCP_PUBLIC_ASSET_URL } = config.env
	const logoImage = `${GCP_PUBLIC_ASSET_URL}/logo.png`

	const sendConfirmEmail = async (user: UserSchemas.User): Promise<'ok'> => {
		const token = await TokenService.create({
			type: 'accountActivation',
			userId: user.id,
			expirationTimeInSeconds: HOUR_IN_SECONDS * 24,
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
	}

	const sendLoginBasicAuth = async (user: UserSchemas.User): Promise<'ok'> => {
		const token = await TokenService.create({
			userId: user.id,
			type: 'login',
			expirationTimeInSeconds: MINUTE_IN_SECONDS * 5,
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
	}

	const sendVerifyNewEmail = async (
		user: UserSchemas.User,
		newEmail: string,
	): Promise<'ok'> => {
		const token = await TokenService.create({
			type: 'emailChange',
			userId: user.id,
			expirationTimeInSeconds: DAY_IN_SECONDS * 3,
		})

		const changeEmail = ChangeEmail({
			companyAddress,
			logoImage,
			name: getFullName(user),
			productName,
			newEmail,
			username: user.username,
			changeEmailUrl: reverse('changeEmail', {
				fullUrl: true,
				args: { token: token.id, newEmail },
			}),
		})

		const html = render(changeEmail)
		const text = render(changeEmail, { plainText: true })

		await emailClient.sendEmail({
			html,
			from: FROM_SUPPORT_EMAIL,
			subject: `Confirm change email for ${productName}`,
			to: newEmail,
			text,
		})

		return 'ok'
	}

	const sendChangedEmail = async (
		user: UserSchemas.User,
		newEmail: string,
	): Promise<'ok'> => {
		const token = await TokenService.create({
			type: 'passwordReset',
			userId: user.id,
			expirationTimeInSeconds: DAY_IN_SECONDS * 5,
		})

		const emailHasBeenChangedEmail = EmailHasBeenChanged({
			companyAddress,
			logoImage,
			name: getFullName(user),
			productName,
			changePasswordUrl: `${config.env.FRONTEND_URL}/reset-password?token=${token.id}`,
			newEmail,
			username: user.username,
		})

		const html = render(emailHasBeenChangedEmail)
		const text = render(emailHasBeenChangedEmail, { plainText: true })

		await emailClient.sendEmail({
			html,
			from: FROM_SUPPORT_EMAIL,
			subject: `Reset password for ${productName}`,
			to: user.email,
			text,
		})

		return 'ok'
	}

	const sendForgotPasswordEmail = async (
		user: UserSchemas.User,
	): Promise<'ok'> => {
		const token = await TokenService.create({
			type: 'passwordReset',
			userId: user.id,
			expirationTimeInSeconds: MINUTE_IN_SECONDS * 5,
		})

		const forgotPasswordEmail = ForgotPasswordEmail({
			companyAddress,
			logoImage,
			name: getFullName(user),
			productName,
			resetPasswordUrl: `${config.env.FRONTEND_URL}/reset-password?token=${token.id}`,
		})

		const html = render(forgotPasswordEmail)
		const text = render(forgotPasswordEmail, { plainText: true })

		await emailClient.sendEmail({
			html,
			from: FROM_SUPPORT_EMAIL,
			subject: `Reset password for ${productName}`,
			to: user.email,
			text,
		})

		return 'ok'
	}

	return {
		sendChangeEmail: sendVerifyNewEmail,
		sendLoginBasicAuth,
		sendConfirmEmail,
		sendForgotPasswordEmail,
		sendChangedEmail,
	}
}

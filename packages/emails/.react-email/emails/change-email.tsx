import { ChangeEmail } from './components/change-email'

export const ChangeEmailPage = (): JSX.Element => {
	return (
		<ChangeEmail
			logoImage='https://storage.googleapis.com/readit-shared-public-assets/logo.png'
			companyAddress='Manila, Philippines'
			productName='Readit'
			changeEmailUrl='http://localhost:4000/api/events/login/utoeueo132'
			name='Mark'
		/>
	)
}

export default ChangeEmailPage

import { ResetPasswordEmail } from './components/reset-password'

export default function Email() {
	return (
		<ResetPasswordEmail
			logoImage='https://storage.googleapis.com/readit-shared-public-assets/logo.png'
			companyAddress='Manila, Philippines'
			resetPasswordUrl='http://localhost:4000/api/events/login/utoeueo132'
			productName='Readit'
			name='John Doe'
		/>
	)
}

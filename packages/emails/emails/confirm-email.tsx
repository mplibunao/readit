import { ConfirmEmail } from './components/confirm-email'

export default function Email() {
	return (
		<ConfirmEmail
			name='John Doe'
			confirmUrl='http://localhost:4000/api/events/confirm-email/utoeueo132'
			logoImage='https://storage.googleapis.com/readit-shared-public-assets/logo.png'
			productName='Readit'
			companyAddress='Manila, Philippines'
		/>
	)
}

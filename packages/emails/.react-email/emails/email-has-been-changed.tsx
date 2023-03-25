import { EmailHasBeenChanged } from './components/email-has-been-changed'

export const EmailHasBeenChangedPage = (): JSX.Element => {
	return (
		<EmailHasBeenChanged
			username='mplibunao'
			newEmail='mark_paolo_libunao@dlsu.edu.ph'
			logoImage='https://storage.googleapis.com/readit-shared-public-assets/logo.png'
			companyAddress='Manila, Philippines'
			productName='Readit'
			changePasswordUrl='http://localhost:4000/api/events/login/utoeueo132'
			name='Mark'
		/>
	)
}

export default EmailHasBeenChangedPage

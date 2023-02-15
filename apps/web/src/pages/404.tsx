import { ErrorLayout } from '@/components/Layout/Error'

export const Custom404 = (): JSX.Element => {
	return (
		<ErrorLayout
			errorCode='404'
			title='Page not found'
			message='Sorry, we couldn’t find the page you’re looking for.'
		/>
	)
}

export default Custom404

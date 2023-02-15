import { ErrorLayout } from '@/components/Layout/Error'

export const Custom404 = (): JSX.Element => {
	return (
		<ErrorLayout
			code='404'
			title='Page not found'
			message='Sorry, we couldn’t find the page you’re looking for.'
			supportSubject='Error 404 Page not found'
		/>
	)
}

export default Custom404

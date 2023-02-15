import { ErrorLayout } from '@/components/Layout/Error'

export const Custom500 = (): JSX.Element => {
	return (
		<ErrorLayout
			errorCode='500'
			title='Something went wrong'
			message='Oopps, something went wrong. Please try again later.'
		/>
	)
}

export default Custom500
